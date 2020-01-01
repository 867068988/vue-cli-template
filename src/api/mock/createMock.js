import Mock from 'mockjs'
import urlParse from 'url-parse'
import qs from 'qs'
import _ from 'lodash'
Mock.setup({ timeout: '100-500' })

/**
 * @param {string} baseURL
 * @param {boolean} [isCollapsed]
 */
export const createMock = (baseURL, isCollapsed = true) =>
  /**
   * @param {string} url 用 reg: 前缀表示正则
   * @param {'get'|'post'|'put'|'patch'|'delete'} [type]
   * @param {(opts, query, body)=>any} func
   */
  (url, type, func) => {
    if (typeof type === 'function') {
      func = type
      type = 'get'
    }
    const fullUrl = url.startsWith('reg:')
      ? new RegExp(`^${baseURL.replace(/\./g, '\\.')}${url.slice(4)}`)
      : baseURL + url

    Mock.mock(fullUrl, type, function(opts) {
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
      const res = func.call(this, opts, query, body)
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
        const logger = console
        const _k = isCollapsed ? 'groupCollapsed' : 'group'
        logger[_k](`mock:${type}:${urlParsed.pathname}`)
        !_.isEmpty(queryCopy) && logger.log('query', queryCopy)
        !_.isEmpty(bodyCopy) && logger.log('body ', bodyCopy)
        logger.log('res  ', resCopy)
        logger.groupEnd()
      }
      return res
    })
  }

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

export default createMock
