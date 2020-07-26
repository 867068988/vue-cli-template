/**
 * 这里的配置项及拦截器通常和业务无关
 * 请求拦截器的执行顺序：最后注册--->最先注册
 * 响应拦截器的执行顺序：最先注册--->最后注册--->then
 * 根据顺序做好数据及状态的传递
 */

import _ from 'lodash'
import qs from 'qs'
import axios from 'axios'
import mergeConfig from 'axios/lib/core/mergeConfig'
import wrapAxios from './wrapAxios'
import exShowLoading from './exShowLoading'
import * as exCancel from './exCancel'

/**
 * 发送前拦截 (全局)
 * @param {Parameters<axios['create']>[0]} config
 */
const requestHandle = config => {
  exCancel.setConfig(config)
  return config
}

/* 发送失败拦截 (全局) */
const requestErrHandle = err => {
  throw err
}

/**
 * 响应成功拦截 (全局)
 * @param {import('axios').AxiosResponse} res
 */
const responseHandle = res => {
  res.exData = _.get(res.data, 'data')
  return res
}

/* 响应失败拦截 (全局) */
const responseErrHandle = err => {
  if (err.response) {
    err.response.exData = _.get(err.response.data, 'data')
  }
  throw err
}

/**
 * @param {Parameters<axios['create']>[0]} requestConfig
 * @param {(instance: ReturnType<axios['create']>) => any} [callback]
 */
export const createAxios = (requestConfig, callback) => {
  const defaults = {
    /* 默认配置 */
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  }
  const instance = wrapAxios(axios.create(mergeConfig(defaults, requestConfig)))
  instance.exHooks.add(exShowLoading)
  instance.exHooks.add(exCancel.hooks)
  instance.interceptors.request.use(requestHandle, requestErrHandle)
  instance.interceptors.response.use(responseHandle, responseErrHandle)
  callback && callback(instance)
  return instance
}

export default createAxios
