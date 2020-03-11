import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import registerInterceptor from './registerInterceptor'
Vue.use(Router)

const mode = 'hash'
const createRouter = function() {
  const base = mode === 'hash' ? '/' : process.env.BASE_URL
  return new Router({ mode, base })
}

/**
 * 全局唯一 Router 实例
 */
export const router = createRouter()

/**
 * 路由重置
 * @param {Array} newRoutes
 */
export const resetRoutes = function(newRoutes) {
  const tempPath = `/__temp-path-${Date.now()}`
  const currentPath = router.currentRoute.fullPath
  router.matcher = createRouter().matcher
  router.addRoutes(router.app ? [{ path: tempPath }, ...newRoutes] : newRoutes)
  if (router.app) {
    router.replace(tempPath)
    router.replace(currentPath)
  }
}

/**
 * 路由过滤（过滤出有权限的路由）
 * @param {(meta:Object,route:Object)=>boolean} filterCallback
 * @returns {Array}
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
