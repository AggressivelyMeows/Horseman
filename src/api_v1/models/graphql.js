import { apolloClient } from 'apollo-server-cloudflare'
import { graphqlCloudflare } from 'apollo-server-cloudflare/dist/cloudflareApollo'

import { router } from '../../router.js'
import { Table } from '../../lib/table.js'

router.get(router.version + '/models/:modelID/gql', router.requires_auth, async (req, res) => {
	const model_table = new Table(
		req.user.id,
		'models'
	)

	const all_models = await model_table.list(
		'__all_objects_index',
		0
	)

	const resolvers = {
		Query: {},
	}

	console.log(all_models)

	resolvers.Query[req.params.modelID] = async (_source, search, { dataSources }) => {
		return await dataSources.router.handle(new Request(
			`http://t.co/v1/models/${req.params.modelID}/objects?key=${req.key}`
		))
	}


	const server = new ApolloServer({
		typeDefs,
		resolvers,
		introspection: true,
		dataSources
	})
})