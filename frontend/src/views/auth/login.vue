<template>
    <div class="max-w-xl mx-auto my-24 rounded-md bg-gray-850 overflow-hidden">
        <div class="">
            <img class="w-full h-48 object-cover mb-2" src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"/>
            <div class="p-4 text-gray-200">
                <o-field label="Email">
                    <o-input class="w-full" v-model="email"/>
                </o-field>

                <o-field label="Password" class="mt-2">
                    <o-input class="w-full" v-model="password" type="password"/>
                </o-field>

                <a class="button ~green @high mt-6 w-full" @click="login">
                    Login
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
            login() {
                this.$api.post(`/auth/login`, { email: this.email, password: this.password }).then(resp => {
                    this.$api.authorize(resp.data.user.token)
                    this.$router.push('/dashboard/models')
                })
            }
        },
    }
</script>