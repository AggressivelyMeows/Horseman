// This is where the magic happens.
// This file is responsible for manaing the data in our "table".
// Since KV has no idea what a table is, we simulate one by creating
// indexes and datastores as if we were a real table.

import { nanoid } from 'nanoid'
import wcmatch from 'wildcard-match'
import { Cache } from './cache.js'
import { ServerTiming } from './timing.js'

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

	// All models require a "spec" to be defined.
	// this ensures the data is always in the same format.
	// Right now, we dont validate spec, but we should in the future.
	// Specs are also responsible for index mangement.
	async get_spec() {
		// hard-coded models schema. this basically never changes but is needed for inital model creation.
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
		const durable = env.IndexWriter.get(env.IndexWriter.idFromName(`${prefix}`))

		const new_index = await durable.fetch(
			`http://internal/v1/write`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prefix, value, objectID, ts: new Date().toISOString() })
			}
		).then(resp => resp.json())

		// If the DO is in a different location, such as if the colo cannot make DOs,
		// then the KV propagation will be extremely slow.
		// we "abuse" the Cache API to act as a pseudo KV solution to allow for instant KV propagation to the colo
		await this.cache.write(
			`${prefix}:index`,
			new_index.index
		)
	}

	async delete_index(prefix, objectID) {
		const durable = env.IndexWriter.get(env.IndexWriter.idFromName(`${prefix}`))

		const new_index = await durable.fetch(
			`http://internal/v1/delete`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prefix, objectID })
			}
		).then(resp => resp.json())

		await this.cache.write(
			`${prefix}:index`,
			new_index.index
		)
	}

	async get(index, search) {
		const timer = new ServerTiming(
			'object-get',
			`${index}:${search}`
		)

		if (index == 'id') {
			// no need for an index
			const obj = await this.cache.read(`${this.get_kv_prefix()}:${search}`, async () => {
				increase_cost('read')
				return await env.CONTENTKV.get(`${this.get_kv_prefix()}:${search}`, { type: 'json',  })
			})

			timer.finish()
			return obj
		}

		const key = `${this.get_kv_prefix()}:${index}:index`

		const idx = await this.cache.read(key, async () => {
			increase_cost('read')
			return await env.INDEXKV.get(key, { type: 'json' })
		})

		if ((!idx || !idx.length)) {
			return null
		}

		const first = idx.find(x => x[0] == search)

		if (!first) {
			return null
		}

		const object = await this.cache.read(`${this.get_kv_prefix()}:${first[1]}`, async () => {
			increase_cost('read')
			return await env.CONTENTKV.get(`${this.get_kv_prefix()}:${first[1]}`, { type: 'json' })
		})

		timer.finish()

		return object
	}

	async put(object, opt) {
		const options = Object.assign({
			update_indexes: true // disable if this is an update operation where the indexed fields dont get changed
		}, opt)

		await this.get_spec()

		if (!object.id) {
			object.id = nanoid(12)
		}

		if (!object.metadata) {
			object.metadata = {
				published: true,
				published_at: new Date().toISOString(),
				created_at: new Date().toISOString(),
			}
		}

		const objectID = `${this.get_kv_prefix()}:${object.id}`

		increase_cost('write')
		object.__all_objects_index = 0

		await env.CONTENTKV.put(objectID, JSON.stringify(object))
		
		const cache_clears = []

		await Promise.all(this.spec.map(async field => {
			if (field.index) {
				increase_cost('write')
				await this.cache.delete(`${this.get_kv_prefix()}:${field.name}:index`)

				const data = await this.index_field(
					// prefix should be userID:tablename:field
					`${this.get_kv_prefix()}:${field.name}`,
					object[field.name],
					object.id
				)

				return data
			} else {
				return Promise.resolve(null)
			}
		}))

		// clear cache of existing IDX
		await Promise.all(cache_clears)

		return object
	}

	async update(existingID, modifications) {
		await this.get_spec()

		const existing = await this.get(
			'id',
			existingID
		)

		const object = Object.assign(
			existing,
			modifications
		)

		const objectID = `${this.get_kv_prefix()}:${object.id}`

		increase_cost('write')
		await env.CONTENTKV.put(objectID, JSON.stringify(object))
		await this.cache.delete(objectID)
		
		const cache_clears = []

		await Promise.all(this.spec.map(async field => {
			if (field.index) {
				if (existing[field.name] != object[field.name]) {
					increase_cost('write')
					const data = await this.index_field(
						// prefix should be userID:tablename:field
						`${this.get_kv_prefix()}:${field.name}`,
						object[field.name],
						object.id
					)

					await this.cache.delete(`${this.get_kv_prefix()}:${field.name}:index`)

					return data
				}
			}

			return 
		}))

		await Promise.all(cache_clears)

		// clear cache of existing IDX
		await this.cache.delete(`${this.get_kv_prefix()}:${existingID}`)

		return object
	}

	
	async delete(objectID) {
		await this.get_spec()

		const key = `${this.get_kv_prefix()}:${objectID}`

		increase_cost('write')
		await env.CONTENTKV.delete(key)

		await Promise.all(this.spec.map(async field => {
			if (field.index) {
				increase_cost('write')
				

				const data = await this.delete_index(
					// prefix should be userID:tablename:field
					`${this.get_kv_prefix()}:${field.name}`,
					objectID
				)

				await this.cache.delete(`${this.get_kv_prefix()}:${field.name}:index`)

				return data
			} else {
				return Promise.resolve(null)
			}
		}))

		await this.cache.delete(`${this.get_kv_prefix()}:${objectID}`)

		return true
	}

	async list(index, search, opt) {
		const options = Object.assign(
			{ mode: 'eq', limit: 30, order: 'oldest_first', read_level: 'preview', resolve: true },
			opt || {}
		)

		const key = `${this.get_kv_prefix()}:${index}:index`

		// get the index from the cache or from the KV store if it's not in the cache yet
		const idx = await this.cache.read(key, async () => {
			increase_cost('read')
			return await env.INDEXKV.get(key, { type: 'json' })
		})

		if ((!idx || !idx.length)) {
			return []
		}

		let is_match
		let is_valid_object

		if (options.mode == 'eq' && typeof search == 'string') {
			is_match = wcmatch(search.toLowerCase())

			is_valid_object = (obj) => {
				if (typeof obj[0] == 'string') {
					return is_match(obj[0].toLowerCase())
				}

				if (Array.isArray(obj[0])) {
					return obj[0].map(x => is_match(x.toLowerCase())).includes(true)
				}

				return obj[0] == search
			}

		} else if (options.mode == 'inc') {
			// replaces all \, with a block of characters, splits on ,, then removes the block and converts to a wildcard supported search
			// to ensure an object is valid, we need to check if all tags in the search string are in the object
			is_match = search.replace('\\,','<INSERTCOMMAHERE>')
				.split(',')
				.map(x => wcmatch(x.replace('<INSERTCOMMAHERE>', ',').toLowerCase()))

			is_valid_object = (obj) => {
				return obj[0].map(x => is_match.map(y => y(x.toLowerCase())).includes(true)).includes(true)
			}

		} else {
			// if mode has no filter or one of the checks fails, we have a default search that just equates both
			is_valid_object = (obj) => {
				return obj[0] == search
			}
		}

		// idx is listed newest last
		const arg = options.limit - ( options.order == 'oldest_first' ? 0 : options.limit * 2 )
		let objects = idx.filter(obj => is_valid_object(obj)).splice(arg)

		// if we are ordering by newest first, reverse the array
		if (options.order == 'newest_first') {
			objects = objects.reverse()
		}

		return (await Promise.all(objects.map(async kx => {
			// since we are not resolving, we can just return the ID
			if (!options.resolve) {
				return kx[1]
			}

			console.log(kx)

			// if we're resolving, we need to get the object
			const obj = await this.get(
				'id',
				kx[1]
			)

			console.log(obj)

			if (!obj) {
				return null
			}

			// if the object is from before we added the publish field
			// bypass the check and return it
			if (!('published' in (obj.metadata || {}))) {
				return obj
			}

			if (obj?.metadata?.published || (!obj?.metadata?.published && options.read_level == 'preview')) {
				return obj
			}

			return null
		}))).filter(x => x)
	}
}