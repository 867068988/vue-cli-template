/* 动态 path 匹配规则：https://github.com/vuejs/vue-router/blob/dev/examples/route-matching/app.js */

import Home from '@/views/Home/index.vue'

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
]

if (process.env.NODE_ENV === 'development') {
  routes.unshift({
    path: '/component-examples',
    meta: { title: '开发相关文档' },
    component: () =>
      import(/* webpackChunkName: "component-examples" */ '@/components/ComponentExamples/index.vue'),
  })
}
export default routes
