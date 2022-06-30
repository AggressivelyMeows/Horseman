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

	if (!env.ALLOW_SIGNUPS) {
		res.body = {
			success: false,
			error: 'Signups are not allowed right now, please try again later.',
			code: 'SIGNUPS_NOT_ALLOWED'
		}
		res.status = 403
		return
	}

	const data = req.body

	if (!data.password) {
		res.body = {
			success: false,
			error: 'No password provided'
		}
		res.status = 400
		return
	}

	const hash_resp = await env.PASSWORD_HASHING.fetch('https://hash.com/v1/hash', {
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
		userID: account.id,
		type: 'public', // public keys are used for accessing Objects that are published
		// a key with the type of `preview` is used for accessing Objects that are marked as "draft"
		permissions: [ 'read:all' ],
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

	const resp = await env.PASSWORD_HASHING.fetch('https://hash.com/v1/compare', {
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
			limit: 100,
			order: 'newest_first'
		}
	)

	res.body = {
		success: true,
		results: keys
	}
})

router.get(router.version + '/auth/keys/:keyID', router.requires_auth, async (req, res) => {
	const tbl = new Table('internal', 'keys')

	const key = await tbl.get(
		'id',
		req.params.keyID
	)

	if (!key) {
		res.body = {
			success: false,
			error: 'Key not found',
			code: 'KEY_NOT_FOUND'
		}
		res.status = 404
		return
	}

	if (key.userID !== req.user.id) {
		res.body = {
			success: false,
			error: 'You do not have permission to access this key',
			code: 'NO_PERMISSION'
		}
		res.status = 403
		return
	}

	res.body = {
		success: true,
		key
	}
})

// POST
router.post(router.version + '/auth/keys', router.requires_auth, async (req, res) => {
	const keys = new Table(
		'internal',
		'keys'
	)

	const key = await keys.put({
		userID: req.user.id,
		type: req.body.type, // public keys are used for accessing Objects that are published
		label: req.body.label.substring(0, 255),
		// a key with the type of `preview` is used for accessing Objects that are marked as "draft"
		permissions: req.body.permissions,
	})

	res.body = {
		success: true,
		key
	}
})

// Update a key
router.post(router.version + '/auth/keys/:keyID', router.requires_auth, async (req, res) => {
	const tbl = new Table(
		'internal',
		'keys'
	)

	const key = await tbl.get(
		'id',
		req.params.keyID
	)

	if (!key) {
		res.body = {
			success: false,
			error: 'Key not found',
			code: 'KEY_NOT_FOUND'
		}
		res.status = 404
		return
	}

	if (key.userID !== req.user.id) {
		res.body = {
			success: false,
			error: 'You do not have permission to access this key',
			code: 'NO_PERMISSION'
		}
		res.status = 403
		return
	}

	const update = {
		type: req.body.type,
		label: req.body.label.substring(0, 255),
		permissions: req.body.permissions,
	}

	await tbl.update(
		req.params.keyID,
		update
	)

	res.body = {
		success: true
	}
})


router.delete(router.version + '/auth/keys/:keyID', router.requires_auth, async (req, res) => {
	const tbl = new Table('internal', 'keys')

	const key = await tbl.get(
		'id',
		req.params.keyID
	)

	if (!key) {
		res.body = {
			success: false,
			error: 'Key not found',
			code: 'KEY_NOT_FOUND'
		}
		res.status = 404
		return
	}

	if (key.userID !== req.user.id) {
		res.body = {
			success: false,
			error: 'You do not have permission to access this key',
			code: 'NO_PERMISSION'
		}
		res.status = 403
		return
	}

	await tbl.delete(
		key.id
	)

	res.body = {
		success: true,
		key
	}
})