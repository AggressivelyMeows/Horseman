import Router from './tsndr_router.js'
import { Table } from './lib/table.js'

const router = new Router()

router.cors()

router.version = '/v1'

router.requires_auth = async (req, res, next) => {
    const token = req.headers.get('Authorization') || req.query.key

    if (!token) {
        res.body = {
            success: false,
            error: 'No authorization token present',
            code: 'AUTH_HEADER_MISSING'
        }
        res.status = 403
        return
    }

    const accounts = new Table(
        'internal',
        'accounts'
    )

    let user
    if (token.includes('User')) {
        user = await accounts.get(
            'token',
            token.split(' ')[1]
        )

        user.authorization_type = 'email'
    } else {
        const key = await (new Table(
            'internal',
            'keys'
        )).get(
            'id',
            token
        )

        user = await accounts.get(
            'id',
            key.userID
        )

        user.authorization_type = 'key'
        user.key = key
    }
    
    req.user = user
    

    await next()
}

router.get('/v1/clr-cache/:id', async (req, res) => {
    const accounts = new Table(
        'internal',
        'accounts'
    )

    res.body = {
        success: await accounts.cache.delete(req.params.id)
    }
})

router.get('/v1/cache/:id', async (req, res) => {
    const accounts = new Table(
        'internal',
        'accounts'
    )

    res.body = {
        cache: await accounts.cache.read(req.params.id)
    }
})

router.get('/v1/kv/read/:id', async (req, res) => {
    res.body = {
        obj: await env.CONTENTKV.get(req.params.id, { type: 'json' }),
        idx: await env.INDEXKV.get(req.params.id, { type: 'json' })
    }
})


router.get('/v1/kv/write', async (req, res) => {
    const ts = new Date().toISOString()
    await env.CONTENTKV.put('testing:kv:latency', JSON.stringify({ date: ts, colo_ray: req.headers.get('cf-ray') }))

    res.body = {
        ts
    }
})

export {
    router
}