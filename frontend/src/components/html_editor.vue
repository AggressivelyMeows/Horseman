<template>
	<QuillEditor theme="snow" v-model:content="html_value"/>
</template>

<script>
	export default {
		data: () => ({
			html_value: '<p>Hello World!</p>'
		}),
		watch: {
			modelValue() {
				this.html_value = 
			},
			html_value() {
				this.$emit('update:modelValue', $event.target.value)
			}
		},
	}
</script>
