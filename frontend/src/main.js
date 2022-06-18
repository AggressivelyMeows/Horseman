import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import API from './api.js'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import Oruga from '@oruga-ui/oruga-next'
import '@oruga-ui/oruga-next/dist/oruga.css'
import Notifications from '@kyvg/vue3-notification'
import { notify } from "@kyvg/vue3-notification"

const app = createApp(App)

const router = createRouter({
    history: createWebHistory(),
    routes,
})

app.use(router)
app.use(Oruga)
app.use(Notifications)

app.config.globalProperties.$api = new API()
app.config.globalProperties.$notify = notify

window.$api = app.config.globalProperties.$api

app.mount('#app')
