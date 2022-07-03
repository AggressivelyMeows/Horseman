<template>
	<div class="grid grid-cols-12 gap-4" >
		<div class="col-span-12 md:col-span-3 mt-4 text-gray-200">
			<b class="text-gray-200  block px-2">
				💽 Your data
			</b>
			 
			<div class="space-y-2 mt-2">
				<router-link to="/dashboard/presets" class="button w-full bg-gray-850 justify-start px-4 py-2 font-medium" active-class="bg-gray-900 text-primary-500">
					Getting started
				</router-link>
				<router-link to="/dashboard/models" class="button w-full bg-gray-850 justify-start px-4 py-2 font-medium" active-class="bg-gray-900 text-primary-500">
					Models
				</router-link>
				<router-link to="/dashboard/access/keys" class="button w-full bg-gray-850 justify-start px-4 py-2 font-medium" active-class="bg-gray-900 text-primary-500">
					API keys
				</router-link>
			</div>

			<b class="text-gray-200 block px-2 mt-4">
				🔏 Your objects
			</b>

			<div class="space-y-2 mt-2">
				<router-link v-for="model in models" :to="`/dashboard/models/${model.id}/objects`" class="button w-full bg-gray-850 justify-start px-4 py-2 font-medium  overflow-hidden" active-class="bg-gray-900 text-primary-500">
					{{model.id}}
				</router-link>
			</div>

			<div v-if="!loading_models && !models.length" class="bg-gray-850 rounded-md p-4 flex flex-col items-center justify-center text-gray-400">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
				</svg>
				You have no models 😢
				<p class="text-xs text-center mt-1">
					Once you have created one, they will show up here for you to add objects to
				</p>
			</div>
		</div>
		<div class="col-span-12 md:col-span-9 rounded-t-md h-full w-full bg-gray-850 overflow-hidden min-h-screen mt-4 md:mt-0">
			<div>
				<router-view/>
			</div>
		</div>
	</div>
</template>

<script>
	import gradient from 'random-gradient'

	export default {
		mounted() {
			this.init()

			this.$api.events.on('dashboard:reset', this.init)
		},
		data: () => ({
			loading: false,
			loading_models: false,
			models: []
		}),
		methods: {
			init() {
				console.log('Loading models')
				this.loading_models = true
				this.$api.get('/models').then(resp => {
					this.models = resp.data.results
				}).finally(() => this.loading_models = false)
			},
			random_gradient(name) {
				return gradient(name)
			},
		}
	}
</script>