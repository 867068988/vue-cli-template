/* 动态 path 匹配规则：https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js */

import Home from '@/views/Home/index.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
]

if (process.env.NODE_ENV === 'development') {
  routes.unshift({
    path: '/component-examples',
    component: () => import('@/components/ComponentExamples/index.vue'),
  })
}

export default routes
