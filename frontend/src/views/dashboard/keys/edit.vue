<template>
    <div class="p-4 text-gray-200 relative">

        <LoadingOverlay
            :loading="loading"
            :loadingMessage="loading_message"
        />

        <o-modal v-model:active="show_delete_modal">
            <h4 class="heading">
                Delete API key
            </h4>
            <h5 class="subheading">
                Deleting this key will mean it cannot be used to access the API anymore. This action is irreversible. Are you sure you want to delete this key?
            </h5>
            <a class="button ~red @high mt-4" @click="del_key">
                Delete key
            </a>
        </o-modal>

        <div class="flex flex-row  items-center">
            <h4 class="heading flex-grow">
                {{ $route.params.keyID == 'new' ? 'Creating' : 'Editing' }} {{key.label || 'API key'}}
            </h4>

            <a class="button ~red @high mr-2" @click="show_delete_modal = true" v-if="$route.params.keyID != 'new'">
                Delete
            </a>

            <a class="button ~green @high ml-2" @click="save">
                {{ $route.params.keyID == 'new' ? 'Create' : 'Save' }}
            </a>
        </div>

        <div class="mt-4 space-y-4 divide-y divide-gray-800">
            <o-field label="API key label" message="Used to help identify the key in the list and search." class="pt-2 flex-grow">
                <input
                    v-model="key.label"
                    class="w-full rounded-md bg-gray-800 text-sm px-2 py-2 border-none border-gray-700 focus:outline-none focus:border-primary-900 focus:ring-primary-600 focus:ring-1"
                    style="border-radius:0.375rem;"
                    placeholder="API key"
                />
            </o-field>
            <o-field label="Key type" message='Used to determine what Objects this key can access. If set to preview, it can read draft Objects as well as published ones. Only affects the read permission.' class="pt-2 flex-grow">
                <o-select v-model="key.type">
                    <option class="text-gray-200" :value="`public`">
                        Public
                    </option>
                    <option class="text-gray-200" :value="`preview`">
                        Preview
                    </option>
                </o-select>
            </o-field>
            <o-field label="Permissions" message="Used to limit what this key can access. Prefix your object name with read or write, for example: read:posts or write:products. Read will allow both listing and reading single objects while write will allow for creation, modification, and deletion of objects." class="pt-2 flex-grow">
                <o-inputitems
                    expanded
                    v-model="key.permissions"
                    placeholder="Add an item"
                    aria-close-label="Delete this item"
                ></o-inputitems>
            </o-field>
        </div>
    </div>
</template>

<script>
    import LoadingOverlay from '@/components/loading_overlay.vue'
    import slugify from 'slugify'

    export default {
        data: () => ({
            loading: false,
            loading_message: '',
            show_delete_modal: false,
            key: {
                id: 'new',
                label: 'new-key',
                type: 'public',
                permissions: [
                    'read:all',
                    'write:all'
                ]
            },
        }),
        async mounted() {
            if (this.$route.params.keyID) {
                // load key from API

                this.loading = true
                this.loading_message = 'Loading API key...'

                await new Promise(r => setTimeout(r, 1000))

                this.$api.get(`/auth/keys/${this.$route.params.keyID}`).then(resp => {
                    this.key = resp.data.key
                }).finally(() => {
                    this.loading = false
                })
            }
        },
        methods: {
            del_key() {
                this.loading = true
                this.loading_message = `Deleting this key`

                this.$api.delete(`/auth/keys/${this.$route.params.keyID}`).then(resp => {
                    this.$notify({
                        title: 'Key deleted',
                        text: 'Due to caching, this key may remain avalible via the API for up to 30 minutes, however we promise its deleted from our systems.',
                        type: 'success',
                    })

                    this.$router.push(`/dashboard/access/keys`)
                }).catch(e => this.$api.error_notification(e)).finally(() => {
                    this.loading = false
                })
            },
            save() {
                this.loading = true
                this.loading_message = `Saving this key`

                const route = `/auth/keys${this.key.id != 'new' ? '/' + this.key.id : ''}`

                this.$api.post(route, this.key).then(resp => {
                    this.$notify({
                        title: 'Key saved',
                        text: 'This key was saved successfully',
                        type: 'success',
                    })

                    this.$router.push(`/dashboard/access/keys`)
                }).catch(e => this.$api.error_notification(e)).finally(() => {
                    this.loading = false
                })
            }
        },
        components: {
            LoadingOverlay
        }
    }
</script>