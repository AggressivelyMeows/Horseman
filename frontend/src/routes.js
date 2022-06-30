import Home from './views/Home.vue'
import About from './views/About.vue'
import NotFound from './views/NotFound.vue'

export const routes = [
	{ path: '/', component: Home, meta: { title: 'Home' } },
	{ path: '/signup', component: () => import('./views/auth/signup.vue') },
	{ path: '/login', component: () => import('./views/auth/login.vue') },
	{ path: '/dashboard', component: () => import('./views/dashboard/base.vue'), children: [
		{ path: '/dashboard/models', component: () => import('./views/dashboard/models/list.vue')},
		{ path: '/dashboard/models/:modelID', component: () => import('./views/dashboard/models/edit.vue')},
		{ path: '/dashboard/access/keys', component: () => import('./views/dashboard/keys/list.vue')},
		{ path: '/dashboard/access/keys/:keyID', component: () => import('./views/dashboard/keys/edit.vue')},
		{ path: '/dashboard/models/:modelID/objects', component: () => import('./views/dashboard/objects/list.vue')},
		{ path: '/dashboard/models/:modelID/editor/:objectID', component: () => import('./views/dashboard/objects/edit.vue')},
	] },

	{ path: '/:path(.*)', component: NotFound },
]
