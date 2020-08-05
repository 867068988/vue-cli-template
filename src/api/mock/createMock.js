import Mock from 'mockjs'
import urlParse from 'url-parse'
import qs from 'qs'
import _ from 'lodash'
Mock.setup({ timeout: '100-600' })

/**
 * @param {string} baseURL
 * @param {boolean} [isGroupOpened]
 */
export const createMock = (baseURL, isGroupOpened = false) =>
  /**
   * @typedef {'get' | 'delete' | 'post' | 'put' | 'patch'} Method
   * @typedef {(opts, query, body) => any} Template
   * @param {string} url 用 reg: 前缀表示正则
   * @param {Method | Template} method
   * @param {Template} [tplFn]
   */
  (url, method, tplFn) => {
    if (typeof method === 'function') {
      tplFn = method
      method = 'get'
    }
    const rurl = url.startsWith('reg:')
      ? new RegExp(`^${_.escapeRegExp(baseURL)}${url.slice(4)}`)
      : baseURL + url

    Mock.mock(rurl, method, function(opts) {
      const urlParsed = urlParse(opts.url)
      /* query & body */
      const query = qs.parse(urlParsed.query.slice(1))
      const body = (() => {
        try {
          return JSON.parse(opts.body)
        } catch (e) {
          return opts.body
        }
      })()
      /* res */
      const res = tplFn.call(this, opts, query, body)
      /* console */
      if (process.env.NODE_ENV === 'development') {
        const queryCopy = removeProto(_.cloneDeep(query))
        const bodyCopy = removeProto(_.cloneDeep(body))
        const resCopy = (() => {
          try {
            return removeProto(JSON.parse(JSON.stringify(res)))
          } catch (e) {
            return removeProto(_.cloneDeep(res))
          }
        })()
        const _k = isGroupOpened ? 'group' : 'groupCollapsed'
        console[_k](`mock:${method}:${urlParsed.pathname}`)
        !_.isEmpty(queryCopy) && console.log('query', queryCopy)
        !_.isEmpty(bodyCopy) && console.log('body ', bodyCopy)
        console.log('res  ', resCopy)
        console.groupEnd()
      }
      return res
    })
  }

// 移除原型，让控制台显示更清爽
const removeProto = value => {
  if (typeof Map === 'undefined' || !Object.setPrototypeOf) return value
  const map = new Map()
  const loop = val => {
    if (_.isObjectLike(val) && !map.has(val)) {
      map.set(val, true)
      Object.setPrototypeOf(val, null)
      _.each(val, v => loop(v))
    }
    return val
  }
  return loop(value)
}

// 使用原始的 console.log（打印没有原型的对象时不会报错）
const console = (() => {
  const _console = window.console
  if (_console.log.toString().includes('[native code]')) {
    return Object.assign(Object.create(_console), { log: _console.log })
  }
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  return iframe.contentWindow.console
})()

// 修复 mockjs 相关 bug
Mock.XHR.prototype.send = (() => {
  const _send = Mock.XHR.prototype.send
  return function() {
    if (!this.match) {
      this.custom.xhr.responseType = this.responseType || ''
      this.custom.xhr.timeout = this.timeout || 0
      this.custom.xhr.withCredentials = this.withCredentials || false
      this.custom.xhr.onabort = this.onabort || null
      this.custom.xhr.onerror = this.onerror || null
      this.custom.xhr.onload = this.onload || null
      this.custom.xhr.onloadend = this.onloadend || null
      this.custom.xhr.onloadstart = this.onloadstart || null
      this.custom.xhr.onprogress = this.onprogress || null
      this.custom.xhr.onreadystatechange = this.onreadystatechange || null
      this.custom.xhr.ontimeout = this.ontimeout || null
    }
    return _send.apply(this, arguments)
  }
})()

export default createMock
