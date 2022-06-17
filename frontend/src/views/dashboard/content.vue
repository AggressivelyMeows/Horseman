<template>
    <div class="p-4">
        <div class="flex flex-row">
            <h4 class="heading flex-grow">
                "{{model.id}}" objects
            </h4>
            <router-link :to="`/dashboard/models/${$route.params.modelID}/editor/new`" class="button ~primary @high text-sm px-3">
                New
            </router-link>
        </div>

        <p class="subheading mb-4 mt-2">
            Create and manage your {{model.id}} objects without needing to create your own interface. Just click and enter the Horseman Editor.
        </p>

        <div class="rounded-md bg-primary-600 text-gray-200 font-medium px-4 py-2 text-sm mb-4">
            Access your data via the API by visiting this URL:
            <br/>
            https://horseman.ceru.dev/v1/models/{{model.id}}/objects?key={{(keys[0] || {}).id}}
        </div>

        <div v-if="loading">
            <p class="text-gray-200 font-medium">
                Loading content, this could take some time if you have a lot.
            </p>
        </div>

        <router-link class="rounded-lg bg-card flex justify-between px-2 py-3 cursor-pointer hover:bg-gray-800" v-for="content in objects" :to="`/dashboard/models/${$route.params.modelID}/editor/${content.id}`">
            <div>
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-md mr-2" :style="{ background: random_gradient(content.id) }"></div>
                    <div class="ml-2">
                        <div class="flex items-center w-full">
                            <div class="mr-2 font-bold text-white flex-grow">
                                {{ content[ model.options.title_field || 'id' ] }}
                            </div>
                        </div>
                        <div class="text-sm text-gray-400">
                            Created {{new Date(content.metadata.created_at).toLocaleDateString()}}
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
                this.$api.get(`/models/${this.$route.params.modelID}/objects`).then(resp => {
                    this.objects = resp.data.results
                    this.model = resp.data.model
                }).finally(() => this.loading = false)

                this.$api.get(`/auth/keys`).then(resp => {
                    this.keys = resp.data.results
                })
            },
            random_gradient(name) {
                return gradient(name)
            },
        },
        data: () => ({
            loading: false,
            objects: [],
            model: {},
            stats: {},
            keys: []
        })
    }
</script>