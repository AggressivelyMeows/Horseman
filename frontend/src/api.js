import axios from 'axios'
import { reactive } from 'vue'

export default class API {
    constructor () {
        this.user_token = localStorage.token || ''
        this.axios = this.create_axios()
        this.state = reactive({})

        if (this.user_token) {
            this.authorize(this.user_token)
        }
    }

    create_axios() {
        return axios.create({
            baseURL: `https://${ import.meta.env.PROD ? 'horseman.ceru.dev' : 'api-dev.constellations.tech' }/v1`,
            timeout: 10000,
            headers: {'Authorization': `User ${this.user_token}`}
        })
    }

    get(route) {
        return this.axios.get(route)
    }

    post(route, body) {
        return this.axios.post(
            route,
            body
        )
    }

    authorize(token) {
        this.user_token = token
        localStorage.token = token
        this.axios = this.create_axios()
        this.get(`/auth/@me`).then(resp => {
            this.state.user = resp.data.user
        })
    }
}