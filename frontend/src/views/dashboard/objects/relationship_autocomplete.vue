<template>
	<div class="w-full">
		<o-autocomplete
			class="w-full"
			v-model="query"
			placeholder="e.g. Posts, Authors, etc."
			:open-on-focus="true"
			:data="results"
			field="id"
			@select="option => selected = option"
		>
			<template v-slot="props">
				{{props.option[model_metadata.options.title_field]}}
			</template>
		</o-autocomplete>
	</div>
</template>

<script>
	export default {
		props: {
			model: {
				type: String,
				required: true,
			},
			modelValue: {
				type: Object,
				required: true,
			},
		},
		data: () => ({
			results: [],
			query: '',
			model_metadata: {}
		}),
		watch: {
			modelValue() {
				this.query = this.modelValue
				this.search()
			},
			query() {
				console.log(this.query)
				this.$emit('update:modelValue', this.query)
			}
		},
		methods: {
			async get_model() {
				await this.$api.get(`/models/${this.model}`).then(resp => {
					this.model_metadata = resp.data.model
				})
			},
			async search() {
				if (!this.model_metadata.id) {
					await this.get_model()
				}

				this.results = []

				this.$api.get(`/models/${this.model}/objects?${this.model_metadata.options.title_field}=eq.*${this.query}*`).then(resp => {
					this.results = resp.data.results
				})
			},
		}
	}
</script>
