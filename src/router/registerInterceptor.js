export default function(router) {
  /* 页面标题处理 */
  router.afterEach(to => {
    const title = to.meta.title
    if (title) {
      document.title = title
    }
  })
}
