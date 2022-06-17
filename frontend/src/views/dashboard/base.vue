<template>
    <div class="grid grid-cols-12 gap-4" >
        <div class="col-span-12 md:col-span-3 mt-4 ">
            <b class="text-gray-200 mb-2 block px-2">
                💽 Your data
            </b>
            
            <router-link to="/dashboard/models" class="button w-full bg-gray-850 text-gray-200 justify-start px-4 py-1.5" active-class="bg-gray-900 text-primary-400">
                Models
            </router-link>

            <b class="text-gray-200 mb-2 block px-2 mt-4">
                🔏 Your objects
            </b>

            <router-link v-for="model in models" :to="`/dashboard/models/${model.id}/content`" class="button w-full bg-gray-850 text-gray-200 justify-start px-4 py-1.5" active-class="bg-gray-900 text-primary-400">
                {{model.id}}
            </router-link>

        </div>
        <div class="col-span-12 md:col-span-9 rounded-t-md h-full w-full bg-gray-850 overflow-hidden min-h-screen">
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
        },
        data: () => ({
            loading: false,
            models: []
        }),
        methods: {
            init() {
                this.loading = true
                this.$api.get('/models/@me').then(resp => {
                    this.models = resp.data.results
                }).finally(() => this.loading = false)
            },
            random_gradient(name) {
                return gradient(name)
            },
        }
    }
</script>