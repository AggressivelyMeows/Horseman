import axios from 'axios'
import { reactive } from 'vue'
import { createNanoEvents } from 'nanoevents'
import { notify } from "@kyvg/vue3-notification"
import * as marked from 'marked'

export default class API {
    constructor () {
        this.user_token = localStorage.token || ''
        
        this.state = reactive({
            reads: 0,
            writes: 0,
            cache_hits: 0
        })

        this.api_url = `https://${ import.meta.env.PROD ? 'horseman.ceru.dev' : 'api-dev.constellations.tech' }/v1`

        this.events = createNanoEvents()
        this.marked = marked

        this.axios = this.create_axios()

        if (this.user_token) {
            this.authorize(this.user_token)
        }
    }

    create_axios() {
        return axios.create({
            baseURL: this.api_url,
            timeout: 10000,
            headers: {'Authorization': `User ${this.user_token}`}
        })
    }

    process_request(data) {
        const stats = JSON.parse(data.headers['x-cost'])

        this.state.reads = this.state.reads + stats.read
        this.state.writes = this.state.writes + stats.write
        this.state.cache_hits = this.state.cache_hits + stats.cache_read
    }

    async get(route) {
        const data = await this.axios.get(route)
        this.process_request(data)

        return data
    }

    async post(route, body) {
        const data = await this.axios.post(
            route,
            body
        )
        this.process_request(data)

        return data
    }

    async delete(route, body) {
        const data = await this.axios.delete(route)
        this.process_request(data)

        return data
    }

    authorize(token) {
        this.user_token = token
        localStorage.token = token
        this.axios = this.create_axios()
        this.get(`/auth/@me`).then(resp => {
            this.state.user = resp.data.user
        })
    }

    error_notification(error_response) {
        if ('response' in error_response) {
            notify({
                title: `We're sorry, there was an error`,
                text: `${error_response.response.status} - ${error_response.response.data.error}`,
                type: 'error'
            })
        } else {
            throw error_response
        }



    }
}