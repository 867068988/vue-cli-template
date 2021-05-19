import Vue from 'vue'
import axios from 'axios'

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
      (isError(reason) && reason.isAxiosError) ||
      axios.isCancel(reason)
    ) {
      event.preventDefault() // 隐藏
    }
  }
})

/* 捕获 Vue 的异常 */
Vue.config.errorHandler = function(err, vm, info) {
  if (info.includes('Promise/async')) {
    Promise.reject(err) // 抛给 unhandledrejection 捕获
    return
  }
  window.console.error(err)
}
