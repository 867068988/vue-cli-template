import { AxiosRequestConfig, AxiosResponse } from 'axios'

declare module 'axios/index' {
  interface AxiosRequestConfig {
    exNoErrorMassage?: boolean // 响应异常时不要弹出消息层
  }
  interface AxiosResponse {
    exData: any // 响应体中 data 的引用
  }
}
