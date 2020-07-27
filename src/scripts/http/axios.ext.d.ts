import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'

declare module 'axios/index' {
  interface AxiosInstance {
    /**
     * 钩子函数队列
     * 所有钩子函数的 config 参数均为同一对象
     * 钩子之间的通信可通过 config 进行
     * 钩子与拦截器之间的通信可能需要通过引用类型的数据进行（与拦截器中的 config 不是同一对象）
     */
    exHooks: Array<{
      // 请求前调用（在请求拦截器之前）
      onBefore?: (config: AxiosRequestConfig) => any

      // 请求完成调用（在响应拦截器之后，then 之前）
      onComplete?: (
        config: AxiosRequestConfig,
        isResolve: boolean,
        resOrErr: AxiosResponse | AxiosError | Error | any,
      ) => any
    }> & {
      // 添加钩子函数的方法，返回的函数可用于移除该钩子函数
      add: (obj: AxiosInstance['exHooks'][0]) => () => any
    }
  }

  interface AxiosRequestConfig {
    exNoErrorMassage?: boolean // 响应异常时不要弹出消息层
    exShowLoading?: boolean // 请求过程中显示全局 loading

    /**
     * 请求前先取消未完成的请求
     * 通过名称来取消一个或一类请求（名称相同的都会被取消），参数值对应名称规则如下：
     *  true ---------- method + baseURL + path
     * '/xxx/*' ------- method + baseURL + '/xxx/*'
     * 'xxx' ---------- 'xxx'
     */
    exCancel?: boolean | string | Array<boolean | string>

    /* 通过该值可以取消该请求 */
    exCancelName?: boolean | string // 参数值对应名称规则同上，默认值为 true
  }

  interface AxiosResponse {
    exData: any // 响应体中 data 的引用
  }
}
