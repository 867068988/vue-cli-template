/* 动态 path 匹配例子：https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js */

import router from '@/router'
import Home from '@/views/Home/index.vue'

/**
 * @type {import('vue-router').RouteConfig[]}
 */
export const routes = [
  {
    path: '/',
    name: 'home',
    meta: { title: '主页' },
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    meta: { title: '关于我们' },
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
  {
    path: '/*',
    name: '404',
    meta: { title: '404' },
    component: () => import(/* webpackChunkName: "error" */ '@/views/404.vue'),
  },
]

if (process.env.VUE_APP_ENV === 'dev' || process.env.VUE_APP_ENV === 'stage') {
  routes.unshift({
    path: '/component-examples',
    name: 'component-examples',
    meta: { title: '开发相关文档' },
    component: () => import('@/components/ComponentExamples/index.vue'),
    beforeEnter(to, from, next) {
      if (from.matched.length === 0 && from.path === '/') {
        next()
        return
      }
      next(false)
      window.open(router.resolve(to.fullPath).href)
    },
  })
}

export default routes
