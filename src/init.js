// Startup script for when the API was just initiated
// 

import { router } from './router.js'
import { Table } from './lib/table.js'


// Basic setup using the built in schema
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
		{'name': 'customerID', 'type': 'string' },
		{'name': 'options', 'type': 'object' },
	])

	const keys = new Table(
		'internal',
		'keys'
	)

	await keys.set_spec([
		{'name': 'userID', 'type': 'string', 'index': true },
		{'name': 'label', 'type': 'string', 'index': true },
		{'name': 'type', 'type': 'string'}, // public or preview
		{'name': 'permissions', 'type': 'array' }
	])

	res.body = {
		success: true
	}
})

router.get(router.version + '/init', async (req, res) => {
	res.body = `
		<script src="https://cdn.tailwindcss.com"></script>

		<div class="flex flex-row">
			<form action="/v1/__meta/init" method="post" class="p-4 bg-gray-900 text-gray-200 min-h-screen  max-w-lg">
				<h1 class="text-purple-500 text-4xl font-bold mb-2">
					Horseman, the headless CMS.
				</h1>
				<p>
					Horseman requires an initial account to be setup before you can import a schema. This account will be used to manage the site. You can change this account later.
				</p>
				<div class="mt-2 flex flex-col">
					<label class="text-gray-300 font-bold mb-2">Inital email</label>
					<input name="default_email" type="text" class="bg-gray-800 rounded-md text-gray-200 p-2" placeholder="Username"/>
				</div>
				<div class="my-2 flex flex-col">
					<label class="text-gray-300 font-bold mb-2">Inital password</label>
					<input name="default_password" type="password" class="bg-gray-800 rounded-md text-gray-200 p-2" placeholder="Password"/>
				</div>
				<div class="my-2 flex flex-col">
					<label class="text-gray-300 font-bold mb-2">Schema</label>
					<textarea name="schema" class="bg-gray-800 rounded-md text-gray-200 p-2" placeholder="Schema"></textarea>
					<p>
						JSON-encoded schema for Horseman to setup your account.
					</p>
				</div>
				<input type="submit" value="Initialize API" class="bg-purple-600 rounded-md p-2 text-gray-200 "/>
			</form>
			<div class="flex-grow bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900"></div>
		</div>

		
	`
	res.headers['Content-Type'] = 'text/html'
})