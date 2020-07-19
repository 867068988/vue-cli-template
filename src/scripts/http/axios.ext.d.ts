import { AxiosRequestConfig, AxiosResponse } from 'axios'

declare module 'axios/index' {
  interface AxiosRequestConfig {
    exNoErrorMassage?: boolean // 告诉拦截器响应异常时不要弹出消息层
    exShowLoading?: boolean // 告诉拦截器请求过程中显示全局 loading
  }
  interface AxiosResponse {
    exData: any // 响应体中 data 的引用
  }
}
