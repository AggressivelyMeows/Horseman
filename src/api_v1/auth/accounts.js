import { router } from '../../router.js'
import { Table } from '../../lib/table.js'

router.get(router.version + '/auth/@me', router.requires_auth, async (req, res) => {
    delete req.user.password_hash

    req.user.options = req.user.options || {} // polyfill, babeyy

    res.body = {
        success: true,
        user: req.user
    }
})

router.post(router.version + '/auth/signup', async (req, res) => {
    const data = req.body

    if (!data.password) {
        res.body = {
            success: false,
            error: 'No password provided'
        }
        res.status = 400
        return
    }

    const hash_resp = await fetch('https://password-hashing.sponsus.workers.dev/v1/hash', {
        method: 'POST',
        headers: { 'Authorization': env.PASSWORD_HASHER_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({
            password: req.body.password
        })
    })

    const hashed_password = (await hash_resp.json()).hash

    const acc = new Table(
        'internal',
        'accounts'
    )

    const account = await acc.put({
        'email': data.email,
        'token': acc.generate_id(20),
        'password_hash': hashed_password
    })

    const keys = new Table(
        'internal',
        'keys'
    )

    // we can use the ID of the key instead of a token since the tok and ID gen are the same generator.
    await keys.put({
        'userID': account.id,
        'permissions': [ 'read:all', 'write:all' ]
    })

    res.body = {
        success: true,
        account
    }
})

router.post(router.version + '/auth/login', async (req, res) => {
    const data = req.body

    const acc = new Table(
        'internal',
        'accounts'
    )

    const existing = await acc.get(
        'email',
        data.email
    )

    const resp = await fetch('https://password-hashing.sponsus.workers.dev/v1/compare', {
        method: 'POST',
        headers: { 'Authorization': env.PASSWORD_HASHER_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({
            password: req.body.password,
            hash: existing.password_hash
        })
    }).then(resp => resp.json())

    if (!resp.is_same) {
        res.body = {
            success: false,
            error: 'Email/password incorrect',
            code: 'INCORRECT_AUTH'
        }
        res.status = 403
        return
    }

    res.body = {
        success: true,
        user: existing
    }
})

router.get(router.version + '/auth/keys', router.requires_auth, async (req, res) => {
    const keys = await new Table('internal', 'keys').list(
        'userID',
        req.user.id,
        {
            order: 'newest_first'
        }
    )

    res.body = {
        success: true,
        results: keys
    }
})