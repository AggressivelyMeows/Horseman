import { nanoid } from 'nanoid'
import { Cache } from './cache.js'

export class Table { 
    constructor (userID, table) {
        this.userID = userID
        this.table = table
        this.cache = new Cache()
        this.spec = {}
    }

    get_kv_prefix() {
        return `${this.userID}:${this.table}`
    }

    generate_id(length) {
        return nanoid(length || 12)
    }

    async get_spec() {
        if (this.table == 'models') {
            this.spec = [
                {
                    name: '__all_objects_index',
                    type: 'string',
                    index: true
                },
                {
                    name: 'spec',
                    type: 'array'
                },
                {
                    name: 'options',
                    type: 'object'
                },
            ]

            return this.spec
        }

        let spec = await this.cache.read(`${this.get_kv_prefix()}:spec`, async () => {
            increase_cost('read')
            return await env.INDEXKV.get(`${this.get_kv_prefix()}:spec`, { type: 'json' })
        })

        this.spec = spec
        return spec
    }
    
    async set_spec(spec) {
        await env.INDEXKV.put(`${this.get_kv_prefix()}:spec`, JSON.stringify(spec))
    }

    async index_field(prefix, value, objectID) {
        const durable = env.IndexWriter.get(env.IndexWriter.idFromName(prefix))

        await durable.fetch(
            `http://internal/v1/write`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prefix, value, objectID })
            }
        )
    }

    async delete_index(prefix, value, objectID) {
        const durable = env.IndexWriter.get(env.IndexWriter.idFromName(prefix))

        await durable.fetch(
            `http://internal/v1/delete`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prefix, value, objectID })
            }
        )
    }

    async get(index, search) {
        console.log(`[read:${this.get_kv_prefix()}] ${index} : ${search}`)

        if (index == 'id') {
            // no need for an index
            return await this.cache.read(`${this.get_kv_prefix()}:${search}`, async () => {
                increase_cost('read')
                return await env.CONTENTKV.get(`${this.get_kv_prefix()}:${search}`, { type: 'json', cacheTtl: 86000 })
            })
        }

        const key = `${this.get_kv_prefix()}:${index}:index`

        const idx = await this.cache.read(key, async () => {
            increase_cost('read')
            return await env.INDEXKV.get(key, { type: 'json', cacheTtl: 120 })
        })

        if ((!idx || !idx.length)) {
            return null
        }

        const first = idx.find(x => x[0] == search)

        increase_cost('read')
        return await env.CONTENTKV.get(`${this.get_kv_prefix()}:${first[1]}`, { type: 'json', cacheTtl: 86000 })
    }

    async put(object, opt) {
        console.log(`[write:${this.get_kv_prefix()}]`, object)
        
        const options = Object.assign({
            update_indexes: true // disable if this is an update operation where the indexed fields dont get changed
        }, opt)

        await this.get_spec()

        if (!object.id) {
            object.id = nanoid(12)
        }

        const objectID = `${this.get_kv_prefix()}:${object.id}`

        increase_cost('write')
        object.__all_objects_index = 0

        await env.CONTENTKV.put(objectID, JSON.stringify(object))
        
        const cache_clears = []

        await Promise.all(this.spec.map(field => {
            if (field.index) {
                cache_clears.push(this.cache.delete(`${this.get_kv_prefix()}:${field.name}:index`))

                increase_cost('write')
                return this.index_field(
                    // prefix should be userID:tablename:field
                    `${this.get_kv_prefix()}:${field.name}`,
                    object[field.name],
                    object.id
                )
            } else {
                return Promise.resolve(null)
            }
        }))

        // clear cache of existing IDX
        await Promise.all(cache_clears)

        return object
    }

    async update(existingID, modifications) {
        console.log(existingID, modifications)
        await this.get_spec()

        const existing = await this.get(
            'id',
            existingID
        )

        const object = Object.assign(
            existing,
            modifications
        )

        console.log(existingID, object)

        const objectID = `${this.get_kv_prefix()}:${object.id}`

        increase_cost('write')
        await env.CONTENTKV.put(objectID, JSON.stringify(object))
        await this.cache.delete(objectID)
        
        const cache_clears = []

        await Promise.all(this.spec.map(field => {
            if (field.index) {
                if (existing[field.name] != object[field.name]) {
                    cache_clears.push(this.cache.delete(`${this.get_kv_prefix()}:${field.name}:index`))

                    increase_cost('write')
                    return this.index_field(
                        // prefix should be userID:tablename:field
                        `${this.get_kv_prefix()}:${field.name}`,
                        object[field.name],
                        object.id
                    )
                }
            }

            return Promise.resolve(null)
        }))

        await Promise.all(cache_clears)

        // clear cache of existing IDX
        

        return object
    }

    
    async delete(objectID) {
        await this.get_spec()

        const key = `${this.get_kv_prefix()}:${objectID}`

        increase_cost('write')
        await env.CONTENTKV.delete(key)

        await Promise.all(Object.keys(this.spec).map(k => {
            const field = this.spec[k]

            if (field.index) {
                increase_cost('write')
                return this.delete_index(
                    // prefix should be userID:tablename:field
                    `${this.get_kv_prefix()}:${k}`,
                    object[k],
                    id
                )
            } else {
                return Promise.resolve(null)
            }
        }))

        return true
    }

    async list(index, search, opt) {
        const options = Object.assign(
            { limit: 10, order: 'oldest_first' },
            opt || {}
        )

        const key = `${this.get_kv_prefix()}:${index}:index`

        const idx = await this.cache.read(key, async () => {
            increase_cost('read')
            return await env.INDEXKV.get(key, { type: 'json', cacheTtl: 120 })
        })

        if (!idx) {
            return []
        }

        // idx is listed newest last
        const arg = options.limit - ( options.order == 'oldest_first' ? 0 : options.limit * 2 )
        let objects = idx.filter(obj => obj[0] == search).splice(arg)

        if (options.order == 'newest_first') {
            objects = objects.reverse()
        }

        return await Promise.all(objects.map(async kx => await this.get('id', kx[1])))
    }
}