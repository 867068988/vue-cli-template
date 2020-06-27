/**
 * 路由权限控制方式：beforeEach | addRoutes | 两者结合
 * 这里封装了 addRoutes 方式，即 resetRoutes 与 filterMapRoutes
 */

import Vue from 'vue'
import Router from 'vue-router'
import scrollBehavior from './scrollBehavior'
import routes from './routes'
import registerInterceptor from './registerInterceptor'
Vue.use(Router)

const mode = 'hash'
const createRouter = function() {
  const base = mode === 'hash' ? '/' : process.env.BASE_URL
  return new Router({ mode, base, scrollBehavior })
}

/**
 * 全局唯一 Router 实例
 */
export const router = createRouter()

/**
 * 路由重置
 * @param {routes} newRoutes
 */
export const resetRoutes = function(newRoutes) {
  router.matcher = createRouter().matcher
  router.addRoutes(newRoutes)
  if (router.app) {
    const { path, query, hash } = router.currentRoute
    router
      .replace({ path, query: { ...query, _resetRoutes: '1' }, hash })
      .then(() => router.replace({ path, query, hash }))
  }
}

/**
 * 路由过滤（过滤出有权限的路由）
 * @param {(meta: object, route: routes[0]) => boolean} filterCallback
 * @returns {routes}
 */
export const filterMapRoutes = function(filterCallback) {
  const loop = curRoutes =>
    curRoutes
      .filter(route => filterCallback(route.meta || {}, route))
      .map(({ children, ...newRoute }) => {
        if (children) newRoute.children = loop(children)
        return newRoute
      })
  return loop(routes)
}

/* 注册路由拦截器 */
registerInterceptor(router)
/* 初始化公共路由 */
resetRoutes(
  filterMapRoutes(meta => {
    return meta.roles === undefined // 如何处理路由权限因项目而异...
  }),
)

export default router
