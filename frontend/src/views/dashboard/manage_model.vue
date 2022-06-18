<template>
    <div class="p-4 text-gray-200 ">
        <div class="flex flex-row  items-center">
            <h4 class="heading flex-grow">
                {{ model.id == 'new' ? 'Creating' : 'Editing' }} {{model.id == 'new' ? 'new model' : model.id}}
            </h4>

            <a class="button ~red @high mr-2" @click="del_model" v-if="$route.params.modelID != 'new'">
                Delete
            </a>
            <a class="button ~green @high" @click="save">
                Save
            </a>
        </div>

        <o-field v-if="model.id == 'new'" label="Model name" message="Used to describe this model while also used to access it via the API." class="mt-2">
            <o-input class="w-full" v-model="model.title"/>
        </o-field>

        <div class="mt-4">
            <div class="flex flex-row items-center mb-2">
                <b class="text-primary-500 flex-grow text-xl">Model specification</b>
                <a class="button ~primary @high text-sm" @click="new_element">
                    New field
                </a>
            </div>

            <p class="text-gray-400 text-sm block pb-2 mb-2 border-b border-gray-800">
                This is used to describe what your data will look like and how you want to store it. As a note, you cannot add new indexable fields once the model is created.
            </p>

            <div class="space-y-4">
                <div v-for="element, idx in model.spec" class="bg-gray-900 rounded-md p-4">
                    <div class="flex flex-row mb-2">
                        <a class="button bg-gray-800 text-gray-200 text-xs px-3 mr-2" @click="move_key(idx, 1)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 " fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </a>
                        <a class="button bg-gray-800 text-gray-200 text-xs px-3 mr-2" @click="move_key(idx, -1)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" />
                            </svg>
                        </a>
                        <a class="button bg-gray-800 text-gray-200 text-xs px-3" @click="model.spec.splice(idx, 1)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </a>
                    </div>

                    <o-field grouped class="mb-4" v-if="!uneditable_fields.includes(element.name)">
                        <o-field label="Type" message="Used to describe this model while also used to access it via the API." class="mt-2" style="flex-grow:0;">
                            <o-select placeholder="Select a name" v-model="element.type">
                                <option value="string">Short text</option>
                                <option value="markdown">Markdown</option>
                                <option value="dropdown">Dropdown</option>
                                <option value="tag">Tag insert</option>
                            </o-select>
                        </o-field>

                        <o-field label="Name" message="Used to describe this model while also used to access it via the API." class="mt-2 flex-grow">
                            <input v-model="element.name" class="w-full rounded-md bg-gray-800 text-sm px-2 py-2 border-none border-gray-700 focus:outline-none focus:border-primary-900 focus:ring-primary-600 focus:ring-1"/>
                        </o-field>
                    </o-field>

                    <div class="mb-2 flex flex-row items-center" v-if="uneditable_fields.includes(element.name)">  
                        <p class="">
                            {{element.name}}
                        </p>
                        <b class="ml-2 text-gray-500 font-medium">
                            {{element.type}}
                        </b>

                    </div>

                    <div v-if="element.type == 'dropdown'" class="mt-2">
                        <div class="flex flex-row items-center mb-2">
                            <b class="text-gray-200 text-sm flex-grow">Dropdown options</b>
                        </div>
                        <o-inputitems v-model="element.args.options" placeholder="Add an item" aria-close-label="Delete this item"></o-inputitems>
                    </div>

                    <div class="mt-2" v-if="element.type == 'string'">
                        <o-checkbox v-model="model.options.title_field" :trueValue="element.name" false-value="">This field is the model's title</o-checkbox>
                    </div>

                    <div class="mt-2" v-if="model.id == 'new' && element.type == 'string'">
                        <o-checkbox v-model="element.index">Indexable</o-checkbox>
                    </div>

                    <div class="mt-2 text-xs text-green-500" v-if="model.id != 'new' && element.index">
                        This field is being indexed.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import slugify from 'slugify'

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
            uneditable_fields: [],
            model: {
                id: 'new',
                title: 'new-model',
                spec: [],
                'options': {
                    title_field: ''
                },
            },
            spec: []
        }),
        watch: {
            model: {
                handler() {
                    this.model.id = this.model.id.toLowerCase().replace(' ', '-')
                },
                deep: true
            }
        },
        mounted() {
            if (this.$route.params.modelID) {
                // load model from API

                this.$api.get(`/models/${this.$route.params.modelID}`).then(resp => {
                    this.model = resp.data.model

                    this.uneditable_fields = this.model.spec.map(field => field.name)
                })

            }
        },
        methods: {
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
            del_model() {
                this.$api.delete(`/models/${this.model.id}`).then(resp => {
                    this.$notify({
                        title: 'Model deleted',
                        text: 'Due to caching, this model may remain avalible via the API for up to 30 minutes, however we promise its deleted from our systems.',
                        type: 'success',
                    })

                    this.$router.push(`/dashboard/models`)
                }).catch(e => this.$api.error_notification(e))
            },
            save() {
                const route = `/models${ this.$route.params.modelID != 'new' ? '/' + this.$route.params.modelID : '' }`

                this.$api.post(route, this.model).then(resp => {
                    this.$router.push(`/dashboard/models`)

                    this.$notify({
                        title: 'Model saved',
                        text: 'This model was saved successfully',
                        type: 'success',
                    })

                    this.$api.events.emit('dashboard:reset')
                })
            }
        }
    }
</script>