/**
 * @type {import('vue-router').RouterOptions['scrollBehavior']}
 */
export default function(to, from, savedPosition) {
  if (to.path !== from.path) {
    if (savedPosition) return savedPosition
    if (to.hash) return { selector: to.hash }
    return { x: 0, y: 0 }
  }
}
