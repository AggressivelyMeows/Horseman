<template>
    <div class="max-w-xl mx-auto my-24 rounded-md bg-gray-850 overflow-hidden">
        <div class="">
            <img class="w-full h-48 object-cover mb-2" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80"/>
            <div class="p-4 text-gray-200">
                <o-field label="Email">
                    <o-input class="w-full" v-model="email"/>
                </o-field>
                <o-field label="Password" class="mt-4">
                    <o-input class="w-full" v-model="password" type="password"/>
                </o-field>

                <a class="button ~primary @high mt-8 w-full" @click="create_account">
                    Signup!
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            email: '',
            password: ''
        }),
        methods: {
            create_account() {
                this.$api.post(`/auth/signup`, { email: this.email, password: this.password }).then(resp => {
                    this.$api.authorize(resp.data.account.token)
                    this.$router.push('/dashboard/models')
                })
            }
        },
    }
</script>