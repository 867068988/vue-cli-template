import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
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
  const tempPath = `/_${Date.now()}`
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

/* 初始化公共路由 */
resetRoutes(
  filterMapRoutes(meta => {
    return meta.rules === undefined // 如何处理路由权限因项目而异...
  }),
)

/* 页面标题处理 */
router.afterEach(to => {
  const title = to.meta.title
  if (title) {
    document.title = title
  }
})

export default router
