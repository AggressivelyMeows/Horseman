import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import API from './api.js'
import { routes } from './routes.js'
import { createRouter, createWebHistory } from 'vue-router'
import Oruga from '@oruga-ui/oruga-next'
import '@oruga-ui/oruga-next/dist/oruga.css'

const app = createApp(App)

const router = createRouter({
    history: createWebHistory(),
    routes,
})

app.use(router)
app.use(Oruga)

app.config.globalProperties.$api = new API()

window.$api = app.config.globalProperties.$api

app.mount('#app')
