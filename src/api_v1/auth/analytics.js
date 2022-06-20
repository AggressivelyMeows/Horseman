import { router } from '../../router.js'
import { Table } from '../../lib/table.js'

router.get(router.version + '/statistics', router.requires_auth, async (req, res) => {

    console.log(`https://api.countapi.xyz/get/horseman.ceru.dev/acc-${req.user.id}-read`)

    const cost_arr = await Promise.all([
        fetch(`https://api.countapi.xyz/get/horseman.ceru.dev/acc-${req.user.id}-read`).then(r=>r.json()),
        fetch(`https://api.countapi.xyz/get/horseman.ceru.dev/acc-${req.user.id}-write`).then(r=>r.json()),
    ])

    res.body = {
        success: true,
        costs: {
            reads: cost_arr[0],
            writes: cost_arr[1]
        }
    }
})