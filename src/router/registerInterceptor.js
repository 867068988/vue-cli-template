/**
 * @param {import('vue-router').default} router
 */
export default function(router) {
  if (router._registerInterceptor) return
  router._registerInterceptor = true

  /* 页面标题处理 */
  router.afterEach(to => {
    const title = to.meta.title
    if (title) {
      document.title = title
    }
  })
}
