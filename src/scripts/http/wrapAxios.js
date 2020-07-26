import _ from 'lodash'
import mergeConfig from 'axios/lib/core/mergeConfig'

const merge = (defaults, config) => {
  config = mergeConfig(defaults, config)
  if (config.method) {
    config.method = config.method.toLowerCase()
  } else if (defaults.method) {
    config.method = defaults.method.toLowerCase()
  } else {
    config.method = 'get'
  }
  return config
}

const fireBefore = (exHooks, config) => {
  exHooks.forEach(({ onBefore }) => onBefore && onBefore(config))
}
const fireComplete = (exHooks, config, isResolve, resOrErr) => {
  exHooks.forEach(
    ({ onComplete }) => onComplete && onComplete(config, isResolve, resOrErr),
  )
}
const complete = (promise, exHooks, config) => {
  promise.then(res => fireComplete(exHooks, config, true, res)).catch(e => e)
  promise.catch(err => fireComplete(exHooks, config, false, err))
  return promise.catch(err => {
    throw err
  })
}

/**
 * 包装所有请求方法，实现相关钩子
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 * @param {AxiosInstance} instance 输入旧的实例
 * @returns {AxiosInstance} 输出新的实例
 */
export default function wrapAxios(instance) {
  const wrap = function(...args) {
    return wrap.request(...args)
  }
  _.each(instance, (val, key) => {
    wrap[key] = val
  })

  wrap.exHooks = []
  wrap.exHooks.add = function(obj) {
    const _id = _.uniqueId(`${Date.now()}`)
    this.push({ ...obj, _id })
    return () => {
      const index = this.findIndex(o => o._id === _id)
      index > -1 && this.splice(index, 1)
    }
  }

  wrap.request = function(config) {
    if (typeof config === 'string') {
      config = arguments[1] || {}
      config.url = arguments[0]
    } else {
      config = config || {}
    }
    config = merge(this.defaults, config)
    fireBefore(this.exHooks, config)
    const promise = instance.request.call(this, config)
    return complete(promise, this.exHooks, config)
  }
  for (const key of ['get', 'delete', 'head', 'options']) {
    wrap[key] = function(url, config) {
      config = merge(this.defaults, { ...config, url })
      fireBefore(this.exHooks, config)
      const promise = instance[key].call(this, url, config)
      return complete(promise, this.exHooks, config)
    }
  }
  for (const key of ['post', 'put', 'patch']) {
    wrap[key] = function(url, data, config) {
      config = merge(this.defaults, { ...config, url, data })
      fireBefore(this.exHooks, config)
      const promise = instance[key].call(this, url, data, config)
      return complete(promise, this.exHooks, config)
    }
  }

  return wrap
}
