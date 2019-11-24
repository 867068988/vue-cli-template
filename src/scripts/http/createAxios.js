import axios from 'axios'
import mergeConfig from 'axios/lib/core/mergeConfig'

/* 发送前拦截 (全局) */
const requestHandle = config => {
  return config
}

/* 发送失败拦截 (全局) */
const requestErrHandle = err => {
  return err
}

/* 响应成功拦截 (全局) */
const responseHandle = res => {
  return res
}

/* 响应失败拦截 (全局) */
const responseErrHandle = err => {
  return err
}

/**
 * @param {Objec} [instanceConfig]
 * @param {(instance)=>void} [func]
 */
export const createAxios = (instanceConfig, func) => {
  if (typeof instanceConfig === 'function') {
    func = instanceConfig
    instanceConfig = {}
  }
  instanceConfig = instanceConfig || {}
  const defaults = {
    /* 默认配置 */
  }
  const instance = axios.create(mergeConfig(defaults, instanceConfig))
  instance.interceptors.request.use(requestHandle, requestErrHandle)
  instance.interceptors.response.use(responseHandle, responseErrHandle)
  func && func(instance)
  return instance
}

export default createAxios
