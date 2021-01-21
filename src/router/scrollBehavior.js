/**
 * @typedef {import('vue-router').Route} Route
 * @param {Route} to
 * @param {Route} from
 */
const isRouteUpdate = function(to, from) {
  if (to.fullPath === from.fullPath) return false // 页面初始进入或刷新
  if (from.matched.length !== to.matched.length) return false
  return from.matched.every((record, i) => record === to.matched[i])
}

/**
 * @type {import('vue-router').RouterOptions['scrollBehavior']}
 */
export default function(to, from, savedPosition) {
  if (!isRouteUpdate(to, from)) {
    if (savedPosition) return savedPosition
    if (to.hash) return { selector: to.hash }
    return { x: 0, y: 0 }
  }
}
