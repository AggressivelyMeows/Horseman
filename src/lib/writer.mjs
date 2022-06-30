// The writer is a durable object tasked with ensuring that all writes are sequencial
// You might ask why?
// Well what happens if two writes come in at the same time?
// Our indexes drop one of the objects as both Workers get the index, append the object, and write it again
// This durable objects job is to sit and just write the indexes and objects to the DB.

import Router from '@tsndr/cloudflare-worker-router'

export class WriterDO {
	constructor(state, env) {
		this.env = env
		this.state = state

		this.tasks = []
	}

	async fetch(req) {
		const router = new Router()

		router.cors()

		router.post(`/v1/write`, async (req, res) => {
			const prefix = req.body.prefix
			const objectID = req.body.objectID
			const value = req.body.value

			const resp = await this.state.blockConcurrencyWhile(async () => {
				// prefix should be userID:tablename:field
				let idx = await this.env.INDEXKV.get(prefix + ':index', { type: 'json' })

				if (!idx) {
					// we need to make an index for this object
					idx = []
				}

				const is_existing = idx.filter(comp => comp[1] == objectID)

				if (is_existing.length > 0) {
					idx = idx.map(comp => {
						if (comp[1] == objectID) {
							comp[0] = value
						}
						return comp
					})
				} else {
					idx.push([ value, objectID ])
				}
				
				await this.env.INDEXKV.put(prefix + ':index', JSON.stringify( idx ))

				return idx
			})

			res.body = {
				success: true,
				index: resp
			}
		})

		router.post(`/v1/delete`, async (req, res) => {
			const prefix = req.body.prefix
			const objectID = req.body.objectID

			const index = await this.state.blockConcurrencyWhile(async () => {
				// prefix should be userID:tablename:field
				let idx = await this.env.INDEXKV.get(prefix + ':index', { type: 'json' })

				if (!idx) {
					return {
						success: false,
						error: 'This object doesnt exist in this index'
					}
				}

				idx = idx.filter(x => x[1] != objectID)

				if (idx.length == 0) {
					await this.env.INDEXKV.delete(prefix + ':index')
				} else {
					await this.env.INDEXKV.put(prefix + ':index', JSON.stringify( idx ))
				}
			})

			res.body = {
				success: true,
				index
			}
		})

		return await router.handle(req)
	}
}