import Vue from 'vue'

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
      process.env.VUE_APP_ENV === 'prod' ||
      (isError(reason) && reason.isAxiosError)
    ) {
      event.preventDefault() // 隐藏
    }
  }
})

Vue.config.warnHandler = function(msg, vm, trace) {
  if (/axios_requestConfig_exCancel/.test(msg)) return // axios 取消的请求
  if (!Vue.config.silent) {
    window.console.error('[Vue warn]: ' + msg + trace)
  }
}
