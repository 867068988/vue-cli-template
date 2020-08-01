/**
 * 全局统一处理异常（隐藏、上报...）
 */

const isError = err => err instanceof Error
const isSystemError = function(err) {
  if (!isError(err)) return false
  const reg = /^(TypeError|SyntaxError|ReferenceError|URIError|EvalError|RangeError)$/
  return reg.test(err.name)
}

/* 捕获 Promise 的异常 */
window.addEventListener('unhandledrejection', function(event) {
  const { reason } = event
  if (!isSystemError(reason)) {
    if (
      process.env.VUE_APP_ENV === 'production' ||
      (isError(reason) && reason.isAxiosError)
    ) {
      event.preventDefault() // 隐藏
    }
  }
})
