
export class Cache {
    constructor () {}

    async read(id, callback) {
        // fires callback if the object is not in the cache, putting the returned value into the cache in its place.
        let cache = caches.default
        const req = new Request(`https://ceru.dev/cache/${id}`)

        let res = await cache.match(req)

        if (!res) {
            log(`[CACHE] [${id}] MISS`)

            let value

            try {
                value = await callback()
            } catch (e) {
                return null
            }
            
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
            {},
            opt
        )

        let cache = caches.default
        const req = new Request(`https://ceru.dev/cache/${id}`)
        const res = new Response(
            JSON.stringify(data)
        )

        await cache.put(req, res)
    }

    async delete(id) {
        let cache = caches.default
        const req = new Request(`https://ceru.dev/cache/${id}`)

        //ctx.waitUntil(async () => {
        await new Promise(r => setTimeout(r, 750))
        await cache.delete(req)
        console.log(`[CACHE] Deleted ${id}`)
    }
}