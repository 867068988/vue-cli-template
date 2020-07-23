/**
 * 全局统一处理异常（隐藏、上报...）
 */

/* 捕获 Promise 的异常 */
window.addEventListener('unhandledrejection', function(event) {
  const { reason } = event
  const errorNameReg = /^(TypeError|SyntaxError|ReferenceError|URIError|EvalError|RangeError)$/
  if (reason instanceof Error && errorNameReg.test(reason.name)) return
  if (process.env.VUE_APP_ENV === 'production') {
    event.preventDefault() // 非开发环境则隐藏其它异常
  }
})
