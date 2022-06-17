import Router from '@tsndr/cloudflare-worker-router'

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


    console.log(token, user)
    
    req.user = user

    await next()
}

export {
    router
}