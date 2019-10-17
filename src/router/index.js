import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const mode = 'hash' // hash | history

export const router = new Router({
  mode,
  base: mode === 'hash' ? '/' : process.env.BASE_URL,
  routes,
})

export default router
