import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
Vue.use(Router)

const mode = 'hash' // hash | history
const createRouter = function() {
  return new Router({
    mode,
    base: mode === 'hash' ? '/' : process.env.BASE_URL,
  })
}

export const router = createRouter()
export const resetRoutes = function(newRoutes) {
  router.matcher = createRouter().matcher
  router.addRoutes(newRoutes)
}
/**
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
export default router

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
