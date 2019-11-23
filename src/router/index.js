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
 * @param { (meta:{title?:string, rules?:string[]}) => boolean } filterCallback
 */
export const filterMapRoutes = function(filterCallback) {
  const loop = curRoutes =>
    curRoutes
      .filter(route => filterCallback(route.meta || {}))
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
    return meta.rules === undefined
  }),
)

/* 设置页面标题 */
router.afterEach(to => {
  const title = to.meta.title
  if (title) {
    document.title = title
  }
})
