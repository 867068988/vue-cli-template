/**
 * 这里的配置项及拦截器通常和业务相关
 * 请求拦截器的执行顺序：最后注册--->最先注册--->catch?
 * 响应拦截器的执行顺序：最先注册--->最后注册--->then|catch
 * 根据顺序做好数据及状态的传递
 */

import createAxios from './createAxios'

/**
 * 发送前拦截
 * @param {Parameters<createAxios>[0]} config
 */
const requestHandle = config => {
  return config
}

/* 发送失败拦截 */
const requestErrHandle = err => {
  throw err
}

/* 响应成功拦截 */
const responseHandle = res => {
  return res
}

/* 响应失败拦截 */
const responseErrHandle = err => {
  throw err
}

export const http = createAxios(
  {
    baseURL: process.env.VUE_APP_BASEURL_API,
  },
  instance => {
    instance.interceptors.request.use(requestHandle, requestErrHandle)
    instance.interceptors.response.use(responseHandle, responseErrHandle)
  },
)

export default http
