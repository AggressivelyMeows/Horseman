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

    const models = await tbl.list(
        index,
        query,
        {
            mode,
            limit: 20,
            order: 'newest_first'
        }
    )

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

    await tbl.update(
        req.params.objectID,
        req.body
    )

    res.body = {
        success: true
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