import createAxios from './createAxios'

/* 发送前拦截 */
const requestHandle = config => {
  return config
}

/* 发送失败拦截 */
const requestErrHandle = err => {
  return err
}

/* 响应成功拦截 */
const responseHandle = res => {
  return res
}

/* 响应失败拦截 */
const responseErrHandle = err => {
  return err
}

export const http = createAxios(
  {
    baseURL: process.env.VUE_APP_BASEURL_XXX,
  },
  instance => {
    instance.interceptors.request.use(requestHandle, requestErrHandle)
    instance.interceptors.response.use(responseHandle, responseErrHandle)
  },
)

export default http
