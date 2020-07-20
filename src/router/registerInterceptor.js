/**
 * @param {import('vue-router').default} router
 */
export default function(router) {
  if (router._registerInterceptor) return
  router._registerInterceptor = true

  /* 页面标题处理 */
  router.afterEach(to => {
    let { title } = to.meta
    title = typeof title === 'function' ? title(to) : title
    if (title) {
      document.title = title
    }
  })
}
