import { router } from './router.js'

export { WriterDO } from './lib/writer.mjs'

import './api_v1/auth/accounts.js'
import './api_v1/models/models.js'
import './api_v1/models/content.js'
import './init.js'

export default {
    async fetch(request, env, ctx) {
        globalThis.cloudflare = request.cf
        globalThis.env = env
        globalThis.ctx = ctx

        globalThis.cost = {
            read: 0, // Times we asked KV for data
            write: 0, // Times we wrote to KV
            cache_read: 0 // Times we found a cached result
        }

        const log = []

        globalThis.increase_cost = (t) => {
            globalThis.cost[t] += 1
        }

        globalThis.log = (l) => {
            console.log(l)
            log.push(l)
        }

        
        router.corsConfig.allowOrigin = '*'
        router.corsConfig.allowHeaders = 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length, x-cost, x-log'

        let resp

        try {
            resp = await router.handle(request)
        } catch (e) {
            console.error(e.toString())
            return new Response('internal server error', { status: 500 })
        }

        const response = new Response(resp.body, resp)

        response.headers.set('X-Cost', JSON.stringify(cost))
        response.headers.set('X-Log', JSON.stringify(log))

        response.headers.set('Access-Control-Expose-Headers', router.corsConfig.allowHeaders)

        const task = async () => {

        }
        

        return response
    }
}

