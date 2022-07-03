<template>
	<div class="p-4 relative">

		<LoadingOverlay
			:loading="loading"
			:loadingMessage="loading_message"
		/>

		<o-modal v-model:active="show_preset_warning_modal">
			<h4 class="heading">
				Use preset {{selected_preset.name}}?
			</h4>
			<h5 class="subheading mt-1">
				Be aware, if you have any models that use the names below, they will be wiped and replaced with the preset.
				This preset will create the following on your account:
			</h5>

			<div class="grid grid-cols-2 mt-2 text-xs" v-if="!log.length">
				<div v-for="model in selected_preset.models">
					<b>
						Model: {{model.id}}
					</b>
					<ul>
						<li v-for="field in model.spec">
							 {{field.index ? '🔍' : ''}} {{field.name}}: {{field.type}}
						</li>
					</ul>
				</div>
			</div>

			<div v-else>
				<p v-for="line in log">{{line.message}}</p>
			</div>

			<a class="button ~green @high mt-4 w-full" @click="activate_preset(false)">
				Activate preset
			</a>
			<a class="button ~red @high mt-2 w-full" @click="activate_preset(true)">
				Activate, but remove all existing models
			</a>
		</o-modal>

		<o-modal v-model:active="show_import_modal">
			<h4 class="heading">
				Import from JSON
			</h4>
			<h5 class="subheading mt-1">
				This will load the JSON you paste below and auto create the models for you. Please validate the JSON is what you are expecting below before clicking the import button.
			</h5>

			<o-field class="mt-2">
				<o-input class="bg-gray-900" variant="dark" type="textarea" v-model="json"/>
			</o-field>

			<p class="text-red-500 text-sm mt-1" v-if="!is_valid_json"> 
				Whoa there! This JSON is not valid. Please check the JSON is valid before importing.
			</p>

			<p class="text-sm mt-2 text-gray-400" v-if="selected_preset?.modals?.length">
				The above JSON will import:
			</p>

			<div class="grid grid-cols-2 mt-2 text-xs" v-if="!log.length">
				<div v-for="model in selected_preset.models">
					<b>
						Model: {{model.id}}
					</b>
					<ul>
						<li v-for="field in model.spec">
							 {{field.index ? '🔍' : ''}} {{field.name}}: {{field.type}}
						</li>
					</ul>
				</div>
			</div>

			<div v-else>
				<p v-for="line in log">{{line.message}}</p>
			</div>

			<a class="button ~green @high mt-4 w-full" @click="activate_preset(false)">
				Import JSON
			</a>
			<a class="button ~red @high mt-2 w-full" @click="activate_preset(true)">
				Import JSON, but remove all existing data
			</a>
		</o-modal>

		<div class="flex flex-col md:flex-row">
			<h4 class="heading flex-grow">
				Presets
			</h4>
			<a @click="show_import_modal = true" class="button ~primary @high text-sm px-3">
				Import from JSON
			</a>
		</div>

		<p class="subheading mb-4 mt-2">
			Get started quickly by clicking one of the presets below! You can also import your own preset by clicking the "Import from JSON" button above. Activating one of the presets will create models on your account.
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 md:gap-8 w-full">
			<div v-for="preset in presets" class="w-full" @click="select_preset(preset)">
				<div class="button glow-on-hover @high w-full mt-4 flex flex-col group">
					{{preset.name}}
					<br/>
					<p class="text-xs">
						{{preset.desc}}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import LoadingOverlay from '@/components/loading_overlay.vue'
	import gradient from 'random-gradient'

	export default {
		mounted() {
			this.init()
		},
		watch: {
			$route() {
				this.init()
			},
			json() {
				this.is_valid_json = true
				this.selected_preset = {}
				try {
					this.is_valid_json = !!JSON.parse(this.json)
				} catch (e) {
					this.is_valid_json = false
				}

				if (this.is_valid_json) {
					this.selected_preset = JSON.parse(this.json)
				}
			}
		},
		methods: {
			async activate_preset(wipe_existing) {
				this.log = []
				this.loading = true
				this.loading_message = 'Activating preset, this may take a few seconds...'

				if (wipe_existing) {
					const models = (await this.$api.get(`/models`)).data.results

					await Promise.all(models.map(async model => {
						await this.$api.delete(`/models/${model.id}`)
					}))
				}

				for (let model of this.selected_preset.models) {
					this.log.push({
						level: 'INFO',
						message: `Checking if ${model.id} already exists...`
					})

					let state = {
						success: false
					}

					try {
						state = await this.$api.get(`/models/${model.id}`)
					} catch (e) {
					}

					if (state.success) {
						this.log.push({
							level: 'INFO',
							message: `Model ${model.id} already exists. Deleting model ${model.id}.`
						})

						await this.$api.delete(`/models/${model.id}`)
					}

					this.log.push({
						level: 'INFO',
						message: `Creating model ${model.id}...`
					})

					await this.$api.post(`/models`, model)

					let cleared = false

					while (!cleared) {
						await new Promise(resolve => setTimeout(resolve, 2000))
						const models = await this.$api.get(`/models`)
						const is_existing = models.data.results.find(x => x.id === model.id)

						if (is_existing) {
							break
						}

						if (!is_existing) {
							this.log.push({
								level: 'INFO',
								message: `Failed to find ${model.id}. Clearing cache and rerunning...`
							})
							
							await this.$api.delete(`/models/models/cache`)
						} else {
							cleared = false
						}
					}

					this.log.push({
						level: 'INFO',
						message: `Finished creating model ${model.id}.`
					})
				}

				this.loading = false
				this.$api.events.emit('dashboard:reset')
				this.show_preset_warning_modal = false
			},
			select_preset(pre) {
				this.selected_preset = pre
				this.show_preset_warning_modal = true
			},
			init() {
				this.loading = true
				this.loading_message = 'Loading content...'
				this.$api.get(`/presets`).then(resp => {
					this.presets = resp.data.presets
				}).finally(() => this.loading = false)

				if (this.$route.query.json) {
					this.json = this.$route.query.json
					this.show_import_modal = true
				}
			},
			random_gradient(name) {
				return gradient(name)
			},
			search() {
				this.loading = true
				this.loading_message = 'Filtering results...'
				this.$api.get(`/models/${this.$route.params.modelID}/objects?${this.model.options.title_field}=eq.*${this.query}*`).then(resp => {
					this.objects = resp.data.results
					this.model = resp.data.model
				}).finally(() => this.loading = false)
			}
		},
		data: () => ({
			loading: false,
			loading_message: '',
			show_preset_warning_modal: false,
			show_import_modal: false,
			selected_preset: {},
			presets: [],
			json: '',
			is_valid_json: true,
			log: []
		}),
		components: {
			LoadingOverlay
		}
	}
</script>


<style scoped lang="postcss">
.glow-on-hover:before {
    content: '';
    background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
    position: absolute;
    top: -2px;
    left:-2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: glowing 20s linear infinite;
    opacity: 0;
    transition: opacity .3s ease-in-out;
}

.glow-on-hover {
    @apply text-gray-200 py-4 mb-4 bg-gray-800 rounded-lg
}

.glow-on-hover:active:after {
    background: transparent;
}

.glow-on-hover:hover:before {
    opacity: 1;
}

.glow-on-hover:hover:after {
    background: #111;
}

.glow-on-hover:after {
    z-index: -1;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    
    left: 0;
    top: 0;
    border-radius: 10px;
    @apply bg-gray-850 transition transition-all duration-500
}

@keyframes glowing {
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
}
</style>