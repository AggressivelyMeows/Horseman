<template>
	<div class="p-4 relative">

		<LoadingOverlay
			:loading="loading"
			:loadingMessage="loading_message"
		/>

		<o-modal v-model:active="show_cache_clear_modal">
			<h4 class="heading">
				Clear cache
			</h4>
			<h5 class="subheading"> 
				Clearing cache will reset the server-side cache for all 250+ locations. This will significantly slow down the speed of your key for the first hit. You will also incur a read hit for each location as your key is requested.
				<br/><br/>
				Horseman manages its own cache efficiently, however if you notice your key is not being served, you can clear the cache manually.
			</h5>
			<a class="button ~yellow @high mt-4" @click="clear_cache">
				Clear {{model.id}}'s cache
			</a>
		</o-modal>

		<div class="flex flex-col md:flex-row">
			<h4 class="heading flex-grow">
				API keys
			</h4>
			<a class="button ~yellow @high text-sm px-3 my-2 mr-0 md:my-0 md:mr-2" v-if="false" @click="show_cache_clear_modal = true">
				Clear cache
			</a>
			<router-link :to="`/dashboard/access/keys/new`" class="button ~primary @high text-sm px-3">
				New
			</router-link>
		</div>

		<p class="subheading mb-4 mt-2">
			Manage how you access your data by limiting what keys can do.
		</p>

		<input
			v-if="false"
			v-model="query"
			@keyup.enter="search"
			class="w-full mb-4 rounded-md text-gray-200 bg-gray-800 text-sm px-2 py-2 border-none border-gray-700 focus:outline-none focus:border-primary-900 focus:ring-primary-600 focus:ring-1"
			placeholder="Search keys, press Enter to search"
		/>

		<!-- Error states -->
		<div v-if="!loading">
			<div v-if="!keys.length" class="bg-gray-800 rounded-md p-4 text-gray-200 flex flex-col items-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
				</svg>
				You have no keys 😢
				<p class="text-xs text-center mt-1" v-if="!query.length">
					Once you have created one, they will show up here for you to add keys to
				</p>
				<p class="text-xs text-center mt-1" v-else>
					Your search query may not have any results, the search box will only find results in the keys title.
				</p>
			</div>
		</div>

		<router-link class="rounded-lg bg-card flex justify-between px-2 py-3 cursor-pointer hover:bg-gray-800" v-for="key in keys" :to="`/dashboard/access/keys/${key.id}`">
			<div class=" w-full">
				<div class="flex items-center w-full">
					<div class="w-10 h-10 rounded-md mr-2" :style="{ background: random_gradient(key.id) }"></div>
					<div class="ml-2 flex-grow">
						<div class="flex items-center w-full">
							<div class="mr-2 font-bold text-white flex-grow">
								{{ key.label || key.id }}
							</div>
						</div>
						<div class="text-sm text-gray-400">
							Created {{new Date(key?.metadata?.created_at).toLocaleDateString()}}
						</div>
					</div>
					<div>
						<span class="chip ~green @high" v-if="key.type == 'public'">
							Public
						</span>
						<span class="chip ~yellow @high" v-else>
							Preview
						</span>
					</div>
				</div>
			</div>
		</router-link>
	</div>
</template>

<script>
	import LoadingOverlay from '@/components/loading_overlay.vue'
	import gradient from 'random-gradient'

	export default {
		mounted() {
			this.init()
		},
		methods: {
			clear_cache() {
				this.loading = true
				this.loading_message = 'Clearing global cache...'
				this.$api.delete(`/models/${this.model.id}/cache`).then(() => {
					this.$notify({
						title: 'Cache cleared',
						text: 'Please give up to 30 seconds for the worldwide cache to be clear',
						type: 'warning',
					})

					this.show_cache_clear_modal = false
				}).finally(() => {
					this.loading = false
				})
			},
			init() {
				this.loading = true
				this.loading_message = 'Loading API keys'
				this.$api.get(`/auth/keys`).then(resp => {
					this.keys = resp.data.results
				}).finally(() => this.loading = false)

				this.$api.get(`/auth/keys`).then(resp => {
					this.keys = resp.data.results
				})
			},
			random_gradient(name) {
				return gradient(name)
			},
		},
		watch: {
			$route() {
				this.init()
			}
		},
		data: () => ({
			loading: false,
			loading_message: '',
			show_cache_clear_modal: false,
			query: '',
			keys: [],
			model: {
				options: {}
			},
			stats: {},
			keys: []
		}),
		components: {
			LoadingOverlay
		}
	}
</script>