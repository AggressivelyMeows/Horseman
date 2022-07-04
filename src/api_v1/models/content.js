import { router } from '../../router.js'
import { Table } from '../../lib/table.js'

import slugify from 'slugify'
import mask from 'json-mask'

// LIST OBJECT
router.get(router.version + '/models/:modelID/objects', router.requires_auth, async (req, res) => {
	const tbl = new Table(
		req.user.id,
		req.params.modelID
	)

	let index = req.query.index || '__all_objects_index'
	let query = req.query.q || 0
	let mode = 'eq'

	const spec = await tbl.get_spec()

	const target = Object.keys(req.query).find(q => spec.map(x => x.name.toLowerCase()).includes(q.toLowerCase()))

	if (target) {
		query = req.query[target]

		// parse query
		if (query.split('.').length == 2) {
			mode = query.split('.')[0]
			query = query.split('.')[1]
		} else {
			res.body = {
				success: false,
				error: 'Query filters require a prefix, for example: "eq.value", "gt.1", "neq.bad value"'
			}
			res.status = 400
			return
		}

		index = target
	}

	let models = await tbl.list(
		index,
		query,
		{
			mode,
			limit: 20,
			order: 'newest_first',
			read_level: req.user.read_level,
		}
	)

	models = models.map(x => {
		let new_obj = Object.assign({}, x)

		Object.keys(x).map(field_key => {
			const field = spec.find(field => field.name.toLowerCase() == field_key.toLowerCase())

			if (field) {
				if (field.type == 'html') {
					new_obj[field_key] = new_obj[field_key].replaceAll('<p><br></p>', '<br/>')
				} else {
					new_obj[field_key] = new_obj[field_key]
				}
			} else {
				new_obj[field_key] = new_obj[field_key]
			}
		})

		return new_obj
	})

	if ('expand' in req.query) {
		const expand = req.query.expand.split(',')

		for (let target of expand) {
			// expand each objects internal fields if the field type is "relationship"
			const is_valid = spec.filter(x => x.type=='relationship')
				.map(x => x.name)
				.includes(target)

			if (!is_valid) {
				res.body = {
					success: false,
					error: 'Invalid expand target: ' + target,
					extra: `Must be one of ${spec.filter(x=>x.type=='relationship').map(x => x.name).join(', ')}`,
					code: 'INVALID_EXPAND_TARGET'
				}
				res.status = 400
				return
			}

			const expand_table = new Table(
				req.user.id,
				spec.find(x => x.name == target).args.model
			)

			models = await Promise.all(models.map(async found_item => {
				const object = await expand_table.get(
					'id',
					found_item[target]
				)

				if (!object.id) {
					found_item[target] = null
					return found_item
				}

				if (req.user.read_level == 'preview' || object?.metadata?.published) {
					delete object.__all_objects_index
					found_item[target] = object
					return found_item
				}

				found_item[target] = {
					error: 'Object is not published, cannot be expanded. This API key does not have the required read level.',
				}

				return found_item
			}))
		}
	}


	res.body = {
		success: true,
		results: models.map(x => {
			delete x.__all_objects_index
			return req.query.fields ? mask(x, req.query.fields) : x
		}),
		model: await (new Table(req.user.id, 'models')).get(
			'id',
			req.params.modelID
		)
	}
})

// GET OBJECT
router.get(router.version + '/models/:modelID/objects/:objectID', router.requires_auth, async (req, res) => {
	const tbl = new Table(
		req.user.id,
		req.params.modelID
	)

	const object = await tbl.get(
		'id',
		req.params.objectID
	)

	delete object.__all_objects_index

	res.body = {
		success: true,
		object
	}
})

// CREATE A NEW OBJECT
router.post(router.version + '/models/:modelID/objects', router.requires_auth, async (req, res) => {
	const tbl = new Table(
		req.user.id,
		req.params.modelID
	)

	req.body.__all_objects_index = 0

	req.body.metadata = {
		userID: req.user.id,
		published: false,
		created_at: new Date().toISOString()
	}

	const model = await tbl.put(req.body)

	res.body = {
		success: true,
		model
	}
})

// UPDATE AN OBJECT
router.post(router.version + '/models/:modelID/objects/:objectID', router.requires_auth, async (req, res) => {
	// create a new model
	const tbl = new Table(
		req.user.id,
		req.params.modelID
	)

	const spec = await tbl.get_spec()

	const update = {}

	spec.map(x => {
		// prevents the user from updating keys and values we need for record keeping like metadata and id.
		if (req.body[x.name]) {
			update[x.name] = req.body[x.name]
		}
	})

	await tbl.update(
		req.params.objectID,
		update
	)

	res.body = {
		success: true
	}
})

// UPDATE AN OBJECTS STATE
router.post(router.version + '/models/:modelID/objects/:objectID/state', router.requires_auth, async (req, res) => {
	const tbl = new Table(
		req.user.id,
		req.params.modelID
	)

	const object = await tbl.get(
		'id',
		req.params.objectID
	)

	if (req.body.published) {
		object.metadata.published = true
		object.metadata.published_at = new Date().toISOString()
	} else {
		object.metadata.published = false
		object.metadata.published_at = null
	}

	await tbl.update(
		req.params.objectID,
		{
			metadata: object.metadata
		}
	)

	res.body = {
		success: true,
		published: object.metadata.published
	}
})

// DELETE AN OBJECT
router.delete(router.version + '/models/:modelID/objects/:objectID', router.requires_auth, async (req, res) => {
	// create a new model
	const tbl = new Table(
		req.user.id,
		req.params.modelID
	)

	await tbl.delete(
		req.params.objectID
	)

	res.body = {
		success: true
	}
})

// CLEAR MODEL CACHE
router.delete(router.version + '/models/:modelID/cache', router.requires_auth, async (req, res) => {
	const tbl = new Table(
		req.user.id,
		req.params.modelID
	)

	await tbl.get_spec()

	// list all of this models indexes
	const indexes = tbl.spec.map(x => x.index ? x.name : null ).filter(x=>x)

	await Promise.all(indexes.map(async x => {
		return tbl.cache.delete(`${tbl.get_kv_prefix()}:${x}:index`)
	}))

	const keys = await tbl.list(
		'__all_objects_index',
		0,
		{
			mode: 'eq',
			limit: 1000,
			resolve: false
		}
	)

	await Promise.all(keys.map(async x => {
		console.log(`${tbl.get_kv_prefix()}:${x}`)
		return tbl.cache.delete(`${tbl.get_kv_prefix()}:${x}`)
	}))

	res.body = {
		success: true,
	}
})