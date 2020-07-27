import _ from 'lodash'
import axios from 'axios'
const { CancelToken, Cancel } = axios
const tokens = {}

/**
 * 请求前处理 config（尽可能在最先注册的拦截器中调用）
 * @param {import('axios').AxiosRequestConfig} config
 */
export const setConfig = function(config) {
  const { method, baseURL = '', url, exCancelName } = config
  const path = url.replace(/\?.*$/, '')

  let name = `${method}${baseURL}${path}`
  if (exCancelName === true) name = `${method}${baseURL}${path}`
  else if (/^\//.test(exCancelName)) name = `${method}${baseURL}${exCancelName}`
  else if (typeof exCancelName === 'string' && exCancelName) name = exCancelName

  let token = config.cancelToken
  if (token instanceof CancelToken === false) {
    token = new CancelToken(_.noop)
  }
  const _promise = token.promise
  token.promise = new Promise(resolve => {
    _promise && _promise.then(resolve).catch(e => e)
    token._exCancel_resolvePromise = resolve
  })
  token._exCancel_id = _.uniqueId(`${Date.now()}`)
  config._exCancel.id = token._exCancel_id
  config._exCancel.name = name
  config.cancelToken = token
  tokens[name] = tokens[name] || []
  tokens[name].push(token)
}

/**
 * 钩子函数
 * @type {import('axios').AxiosInstance['exHooks'][0]}
 */
export const hooks = Object.freeze({
  onBefore(config) {
    config._exCancel = {} // 钩子与拦截器之间的通信对象
    if (config.exCancel) {
      const { method, baseURL = '', url, exCancel } = config
      const path = url.replace(/\?.*$/, '')

      let names = Array.isArray(exCancel) ? exCancel : [exCancel]
      names = _.union(names).map(name => {
        if (name === true) return `${method}${baseURL}${path}`
        if (/^\//.test(name)) return `${method}${baseURL}${name}`
        if (typeof name === 'string') return name
      })
      cancel(names.filter(Boolean))
    }
  },
  onComplete(config) {
    const { id, name } = config._exCancel
    const arr = tokens[name]
    if (id && arr) {
      const index = arr.findIndex(token => token._exCancel_id === id)
      if (index > -1) {
        arr.splice(index, 1)
        if (arr.length === 0) delete tokens[name]
      }
    }
  },
})

/**
 * 取消未完成的请求
 * @param {string | string[]} name exCancelName 参数值对应的名称
 */
export const cancel = function(name) {
  const names = Array.isArray(name) ? name : [name]
  _.each(tokens, (val, key) => {
    if (names.includes(key)) {
      val.forEach(token => {
        if (token.reason) return
        token.reason = new Cancel('')
        token._exCancel_resolvePromise(token.reason)
      })
      delete tokens[key]
    }
  })
}
