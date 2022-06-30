<template>
	<div :class="`absolute top-0 left-0 w-full h-full bg-gray-850 z-10 transiton-all duration-[200ms] flex flex-col items-center justify-center py-24 text-gray-200 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`">
		<div class="flex items-center justify-center flex-col">
			<img class="w-24 h-24" src="https://c.tenor.com/aaEMtGfZFbkAAAAi/rat-spinning.gif" v-if="rat_percent" @click="go_to_free_bird"/>

			<svg v-if="!rat_percent" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>

			<b class="text-lg mt-2">
				{{ loadingMessage || 'Loading your Object!' }}
			</b>
			<p class="text-sm font-medium text-gray-400">
				Shouldnt take long...
			</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'LoadingOverlay',
		props: {
			loading: {
				type: Boolean,
				default: false
			},
			loadingMessage: {
				type: String,
				default: 'Loading your Object!'
			},
		},
		methods: {
			go_to_free_bird() {
				// create an A tag and set the href to the link and click it
				var a = document.createElement('a');
				a.href = 'https://www.youtube.com/watch?v=euik1Zrs30w';
				a.target = '_blank'
				a.click();
			}
		},
		data: () => ({
			rat_percent: Math.random() * 100 > 99
		}),
		watch: {
			loading() {
				this.rat_percent = Math.random() * 100 > 99
			}
		}
	}
</script>
