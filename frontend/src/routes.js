import Home from './views/Home.vue'
import About from './views/About.vue'
import NotFound from './views/NotFound.vue'

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  { path: '/', component: Home, meta: { title: 'Home' } },
  { path: '/signup', component: () => import('./views/auth/signup.vue') },
  { path: '/login', component: () => import('./views/auth/login.vue') },
  { path: '/dashboard', component: () => import('./views/dashboard/base.vue'), children: [
    { path: '/dashboard/models', component: () => import('./views/dashboard/models.vue')},
    { path: '/dashboard/models/:modelID', component: () => import('./views/dashboard/manage_model.vue')},
    { path: '/dashboard/models/:modelID/content', component: () => import('./views/dashboard/content.vue')},
    { path: '/dashboard/models/:modelID/editor/:objectID', component: () => import('./views/dashboard/editor.vue')},
  ] },

  { path: '/:path(.*)', component: NotFound },
]
