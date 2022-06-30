import { router } from '../../router.js'
import { Table } from '../../lib/table.js'

import slugify from 'slugify'

router.get(router.version + '/models', router.requires_auth, async (req, res) => {
	const tbl = new Table(
		req.user.id,
		'models'
	)

	const models = await tbl.list(
		'__all_objects_index',
		0,
		{
			limit: 20,
			order: 'newest_first'
		}
	)

	res.body = {
		success: true,
		results: models
	}
})

router.get(router.version + '/models/:modelID', router.requires_auth, async (req, res) => {
	const tbl = new Table(
		req.user.id,
		'models'
	)

	let model = await tbl.get(
		'id',
		req.params.modelID
	)

	if (!model) {
		res.body = { success: false, error: 'Model not found' }
		res.status = 404
		return
	}

	if (model.userID != req.user.id) {
		res.body = { success: false, error: 'You do not own this model' }
		res.status = 403
		return
	}

	model.spec = model.spec.filter(field => field.name != '__all_objects_index')

	model.options = model.options || {}

	res.body = {
		success: true,
		model
	}
})

router.post(router.version + '/models', router.requires_auth, async (req, res) => {
	// create a new model
	const tbl = new Table(
		req.user.id,
		'models'
	)

	// map the spec to a URL safe form while also doing spec validation
	const spec = req.body.spec.map(field => {
		//field.name = slugify(field.name, '_').toLowerCase()
		return field
	})

	// might be asking why do we force all objects to have an index like below?
	// this is because the DB has no native list all objects without there being a unified index for all models and objects
	// this field is hidden from the user, cannot be set, cannot be deleted, cannot be read
	spec.push({
		name: '__all_objects_index',
		type: 'string',
		index: true
	})

	const model = await tbl.put({
		id: slugify(req.body.title, '-').toLowerCase(),
		userID: req.user.id,
		spec,
		options: req.body.options,
		created_at: new Date().toISOString()
	})

	// get table reference
	const model_table = new Table(
		req.user.id,
		slugify(req.body.title, '-').toLowerCase()
	)

	await model_table.set_spec(spec)

	res.body = {
		success: true,
		model
	}
})

// UPDATE a model
router.post(router.version + '/models/:modelID', router.requires_auth, async (req, res) => {
	// create a new model
	const tbl = new Table(
		req.user.id,
		'models'
	)

	const existing = await tbl.get(
		'id',
		req.params.modelID
	)

	// map the spec to a URL safe form while also doing spec validation
	const spec = req.body.spec.map(field => {
		//field.name = slugify(field.name, '_').toLowerCase()
		return field
	})

	// might be asking why do we force all objects to have an index like below?
	// this is because the DB has no native list all objects without there being a unified index for all models and objects
	// this field is hidden from the user, cannot be set, cannot be deleted, cannot be read
	spec.push({
		name: '__all_objects_index',
		type: 'string',
		index: true
	})

	await tbl.update(
		req.params.modelID,
		{
			options: req.body.options,
			spec,
		}
	)

	// get table reference
	const model_table = new Table(
		req.user.id,
		existing.id
	)

	await model_table.set_spec(spec)

	res.body = {
		success: true
	}
})

// DELETE A MODEL
router.delete(router.version + '/models/:modelID', router.requires_auth, async (req, res) => {
	// create a new model
	const tbl = new Table(
		req.user.id,
		req.params.modelID
	)

	const idx_keys = (
		await env.INDEXKV.list({
			prefix: tbl.get_kv_prefix()
		})
	).keys.map(k => k.name)

	const object_keys = (
		await env.CONTENTKV.list({
			prefix: tbl.get_kv_prefix()
		})
	).keys.map(k => k.name)

	console.log(idx_keys, object_keys)

	await Promise.all([
		Promise.all(idx_keys.map(k => env.INDEXKV.delete(k))),
		Promise.all(object_keys.map(k => env.CONTENTKV.delete(k))),
	])

	await new Table(req.user.id, 'models').delete(
		req.params.modelID
	)

	res.body = {
		success: true
	}
})