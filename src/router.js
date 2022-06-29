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
        user.read_level = 'preview'
        user.permissions = [
            'read:all',
            'write:all'
        ]
    } else {
        const key = await (new Table(
            'internal',
            'keys'
        )).get(
            'id',
            token
        )

        if (!key) {
            res.body = {
                success: false,
                error: 'Invalid authorization token',
                code: 'AUTH_TOKEN_INVALID'
            }
            res.status = 403
            return
        }

        user = await accounts.get(
            'id',
            key.userID
        )

        user.authorization_type = 'key'
        user.read_level = key.type
        user.key = key
        user.permissions = key.permissions
    }
    
    req.user = user

    if (user.authorization_type == 'key' && !'modelID' in req.params) {
        res.body = {
            success: false,
            error: 'Invalid use of an API key, must be used with a model',
            code: 'AUTH_KEY_INVALID'
        }
        res.status = 403
        return
    }

    if ('modelID' in req.params) {
        // this is a request targeting one of the models on the API
        // check if the user has the right to access this model
        const model = req.params.modelID

        if (req.method == 'GET' && !user.permissions.includes('read:all')) {
            if (!user.permissions.includes(`read:${model}`)) {
                res.body = {
                    success: false,
                    error: 'This key does not have access to read this model. Please validate your permissions with the owner of this key.',
                    code: 'AUTH_MODEL_DENIED'
                }
                res.status = 403
                return
            }
        }

        if (['POST', 'DELETE'].includes(req.method) && !user.permissions.includes('write:all')) {
            if (!user.permissions.includes(`write:${model}`)) {
            
                res.body = {
                    success: false,
                    error: 'This key does not have access to write to this model. Please validate your permissions with the owner of this key.',
                    code: 'AUTH_MODEL_DENIED'
                }
                res.status = 403
                return
            }
        }
    }

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