<template>
    <div class="p-4">
        <div class="flex flex-row">
            <h4 class="heading flex-grow">
                Models
            </h4>
            <router-link to="/dashboard/models/new" class="button ~primary @high text-sm px-3">
                New
            </router-link>
        </div>
        <p class="subheading mb-4 mt-2">
            Models are like buckets of objects that can be read later on. To store data with Horseman, you first need a model to store them in. Please be aware that indexes cannot be added once a model is created.
        </p>

        <div v-if="loading">
            <p class="text-gray-200 font-medium">
                Loading models, this could take some time if you have a lot.
            </p>
        </div>

        <router-link class="rounded-lg bg-card flex justify-between px-2 py-3 cursor-pointer hover:bg-gray-800" v-for="model in models" :to="`/dashboard/models/${model.id}`">
            <div>
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-md mr-2" :style="{ background: random_gradient(model.id) }"></div>
                    <div class="ml-2">
                        <div class="flex items-center">
                            <div class="mr-2 font-bold text-white">
                                {{model.id}}
                            </div>
                        </div>
                        <div class="text-sm text-gray-400">
                            Created {{new Date(model.created_at).toLocaleDateString()}}
                        </div>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
    import gradient from 'random-gradient'
    
    function relDiff(a, b) {
        return ((a - b) / b) * 100
    }

    export default {
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.loading = true
                this.$api.get('/models').then(resp => {
                    this.models = resp.data.results
                }).finally(() => this.loading = false)
            },
            random_gradient(name) {
                return gradient(name)
            },
        },
        data: () => ({
            loading: false,
            models: [],
            stats: {}
        })
    }
</script>