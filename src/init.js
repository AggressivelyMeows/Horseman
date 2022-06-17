// Startup script for when the API was just initiated
// 

import { router } from './router.js'
import { Table } from './lib/table.js'

router.get(router.version + '/__meta/init', async (req, res) => {
    // create the accounts "table"
    
    const accounts = new Table(
        'internal',
        'accounts'
    )

    await accounts.set_spec([
        {'name': 'email', 'type': 'string', 'index': true },
        {'name': 'token', 'type': 'string', 'index': true },
        {'name': 'password_hash', 'type': 'string' },
        {'name': 'customerID', 'type': 'string' }
    ])

    const keys = new Table(
        'internal',
        'keys'
    )

    await keys.set_spec([
        {'name': 'userID', 'type': 'string', 'index': true },
        {'name': 'permissions', 'type': 'array' }
    ])

    res.body = {
        success: true
    }
})