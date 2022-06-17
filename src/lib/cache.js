
export class Cache {
    constructor () {}

    async read(id, callback) {
        // fires callback if the object is not in the cache, putting the returned value into the cache in its place.
        let cache = caches.default
        const req = new Request(`https://cache.com/${id}`)

        let res = await cache.match(req)

        if (!res) {
            log(`[CACHE] [${id}] MISS`)
            const value = await callback()
            res = value

            await this.write(
                id,
                value
            )
        } else {
            increase_cost('cache_read')
            log(`[CACHE] [${id}] HIT`)
            res = await res.json()
        }

        return res
    }

    async write(id, data, opt) {
        const options = Object.assign(
            { ttl: 600 },
            opt
        )

        let cache = caches.default
        const req = new Request(`https://cache.com/${id}`)
        const res = new Response(
            JSON.stringify(data),
            {
                headers: {
                    'Cache-Control': `s-maxage=${options.ttl}`
                }
            }
        )

        await cache.put(req, res)
    }

    async delete(id) {
        let cache = caches.default
        const req = new Request(`https://cache.com/${id}`)
        await cache.delete(req)
    }
}