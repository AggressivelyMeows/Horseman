<template>
	<div class="p-4 text-gray-200 relative">

		<LoadingOverlay
			:loading="loading"
			:loadingMessage="loading_message"
		/>

		<div class="flex flex-row  items-center">
			<h4 class="heading flex-grow">
				{{ $route.params.objectID == 'new' ? 'Creating' : 'Editing' }} {{model.id}}
			</h4>

			<a class="button ~red @high mr-2" @click="del_object" v-if="$route.params.objectID != 'new'">
				Delete
			</a>

			<a class="button ~yellow @high" @click="publish" v-if="object?.metadata?.published && $route.params.objectID != 'new'">
				Unpublish
			</a>

			<a class="button ~green @high" @click="publish" v-if="!object?.metadata?.published && $route.params.objectID != 'new'">
				Publish
			</a>

			<a class="button ~green @high ml-2" @click="save">
				{{ $route.params.objectID == 'new' ? 'Create' : 'Save' }}
			</a>
		</div>

		<div class="mt-4 space-y-4 divide-y divide-gray-800">
			<div v-for="element, idx in model.spec" class="">
				<o-field :label="element.name" :message="element.help" class="mt-2 flex-grow">
					<input
						v-if="element.type == 'string'"
						v-model="object[element.name]"
						class="w-full rounded-md bg-gray-800 text-sm px-2 py-2 border-none border-gray-700 focus:outline-none focus:border-primary-900 focus:ring-primary-600 focus:ring-1"
						style="border-radius:0.375rem;"
						:placeholder="`${element.name}`"
					/>

					<textarea v-if="element.type == 'markdown'" v-model="object[element.name]" :placeholder="`${element.name}`" textarea class="w-full rounded-md bg-gray-800 text-sm px-2 py-2 border-none border-gray-700 focus:outline-none focus:border-primary-900 focus:ring-primary-600 focus:ring-1"/>

					<o-select v-if="element.type == 'dropdown'" :placeholder="`${element.name}`" v-model="object[element.name]">
						<option class="text-gray-200" :value="v" v-for="v in element.args.options">{{v}}</option>
					</o-select>

					<o-inputitems expanded v-if="element.type == 'tag'" v-model="object[element.name]" placeholder="Add an item" aria-close-label="Delete this item"></o-inputitems>
				
					<div v-if="element.type == 'html' && object[element.name] != undefined" class="w-full">
						<QuillEditor
							theme="snow"
							contentType="html"
							:toolbar="toolbar"
							:modules="modules"
							v-model:content="object[element.name]"
							placeholder="Start typing your content here!"
						/>
					</div>

					<RelationshipAutocomplete 
						v-if="element.type == 'relationship'"
						v-model="object[element.name]"
						:model="element.args.model"
					/>

				</o-field>
			</div>
		</div>
	</div>
</template>

<script>
	import LoadingOverlay from '@/components/loading_overlay.vue'
	import RelationshipAutocomplete from './relationship_autocomplete.vue'
	import slugify from 'slugify'
	import { QuillEditor } from '@vueup/vue-quill'
	import '@vueup/vue-quill/dist/vue-quill.snow.css'
	import htmlEditButton from "quill-html-edit-button"


    const modules = {
		name: 'htmlEditButton',
		module: htmlEditButton,
		options: {
			debug: true
		},
    }

	const toolbar = [
		[
			{ 'header': [1, 2, 3, 4, 5, 6, false] },
			{ 'font': [] },
			{ 'align': [] }
		],

		['bold', 'italic', 'underline', 'strike'],        // toggled buttons
		['blockquote', 'code-block'],

		[{ 'list': 'ordered'}, { 'list': 'bullet' }],
		
		[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

		['clean'],
	]

	function array_move(arr, old_index, new_index) {
		if (new_index >= arr.length) {
			var k = new_index - arr.length + 1;
			while (k--) {
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		return arr; // for testing
	};

	export default {
		data: () => ({
			loading: false,
			loading_message: '',
			toolbar,
			modules,
			object: {},
			model: {
				id: 'new',
				title: 'new-model',
				spec: []
			},
			spec: []
		}),
		async mounted() {
			if (this.$route.params.modelID) {
				// load model from API

				this.loading = true

				await new Promise(r => setTimeout(r, 1000))

				this.$api.get(`/models/${this.$route.params.modelID}`).then(resp => {
					this.model = resp.data.model

					if (this.$route.params.objectID == 'new') {
						this.model.spec.map(field => {
							this.object[field.name] = {
								string: '',
								markdown: '',
								dropdown: '',
								html: '',
								tag: []
							}[field.type]
						})
					} else {
						this.$api.get(`/models/${this.$route.params.modelID}/objects/${this.$route.params.objectID}`).then(resp => {
							this.object = resp.data.object

							this.model.spec.map(field => {
								const has_value = this.object[field.name] != undefined

								if (!has_value) {
									this.object[field.name] = {
										string: '',
										markdown: '',
										dropdown: '',
										html: '',
										tag: []
									}[field.type]
								}
							})
						})
					}
				}).finally(() => {
					this.loading = false
				})

			}
		},
		methods: {
			publish() {
				//this.object.metadata.published = !this.object.metadata.published

				this.loading = true
				this.loading_message = `${!this.object.metadata.published ? 'Publishing' : 'Un-publishing'} this Object`

				this.$api.post(`/models/${this.$route.params.modelID}/objects/${this.$route.params.objectID}/state`, { published: !this.object.metadata.published }).then(resp => {
					this.object.metadata.published = resp.data.published
				}).finally(() => {
					this.loading = false
				})
			},
			move_key(idx, move) {
				this.model.spec = array_move(
					this.model.spec,
					idx,
					idx + move
				)
			},
			new_dropdown_option(field_idx, key) {
				this.model.spec[field_idx].args.options = this.model.spec[field_idx].args.options || []

				this.model.spec[field_idx].args.options.push('')
			},
			new_element() {
				this.model.spec.push({
					name: 'New Field',
					type: 'string',
					args: {}
				})
			},
			del_object() {
				this.loading = true
				this.loading_message = `Deleting this Object`

				this.$api.delete(`/models/${this.model.id}/objects/${this.$route.params.objectID}`).then(resp => {
					this.$notify({
						title: 'Object deleted',
						text: 'Due to caching, this object may remain avalible via the API for up to 30 minutes, however we promise its deleted from our systems.',
						type: 'success',
					})

					this.$route.push(`/dashboard/models/${this.model.id}/content`)
				}).catch(e => this.$api.error_notification(e)).finally(() => {
					this.loading = false
				})
			},
			save() {
				this.loading = true
				this.loading_message = `Saving this Object`

				const route = `/models/${this.model.id}/objects` + (this.$route.params.objectID == 'new' ? '' : `/${this.$route.params.objectID}`)

				this.$api.post(route, this.object).then(resp => {
					this.$notify({
						title: 'Object saved',
						text: 'This object was saved successfully',
						type: 'success',
					})

					this.$router.push(`/dashboard/models/${this.$route.params.modelID}/objects`)
				}).catch(e => this.$api.error_notification(e)).finally(() => {
					this.loading = false
				})
			}
		},
		components: {
			QuillEditor,
			LoadingOverlay,
			RelationshipAutocomplete
		}
	}
</script>