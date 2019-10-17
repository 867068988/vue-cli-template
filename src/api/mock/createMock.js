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
   * @param {string} [type]
   * @param {Function} func
   */
  (url, type, func) => {
    if (typeof type === 'function') {
      func = type
      type = 'get'
    }
    let fullUrl = url.replace(/^(reg:|)/, baseURL)
    fullUrl = /^reg:/.test(url) ? RegExp(`^${fullUrl}`) : fullUrl

    if (process.env.NODE_ENV === 'development') {
      Mock.mock(fullUrl, type, function(opts) {
        const urlParsed = urlParse(opts.url)
        /* query & body */
        const query = removeProto(qs.parse(urlParsed.query.slice(1)))
        let body
        try {
          body = removeProto(JSON.parse(opts.body))
        } catch (e) {
          body = removeProto(_.cloneDeep(opts.body))
        }
        /* res & resCopy */
        const res = func.apply(this, arguments)
        let resCopy
        try {
          resCopy = removeProto(JSON.parse(JSON.stringify(res)))
        } catch (e) {
          resCopy = removeProto(_.cloneDeep(res))
        }
        /* console */
        const logger = console
        const k = isCollapsed ? 'groupCollapsed' : 'group'
        logger[k](`mock:${type}:${urlParsed.pathname}`)
        !_.isEmpty(query) && logger.log('query', query)
        !_.isEmpty(body) && logger.log('body ', body)
        logger.log('res  ', resCopy)
        logger.groupEnd()
        return res
      })
      return
    }
    Mock.mock(fullUrl, type, function() {
      return func.apply(this, arguments)
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
