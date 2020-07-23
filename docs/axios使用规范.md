axios 中文文档：<a href="http://www.axios-js.com/zh-cn/docs/" target="_blank">http://www.axios-js.com/zh-cn/docs/</a>

### 请求入参用法

#### Query String Parameters

```ts
import http from '@/scripts/http'
import qs from 'qs'

const params = {
  pageNum: 1,
  pageSize: 10,
  keyword: '深圳',
  status: [1, 2],
  // ...
}
const paramsSerializer = params => {
  // indices ----> ?pageNum=1&pageSize=10&keyword=深圳&status[0]=1&status[1]=2
  // brackets ---> ?pageNum=1&pageSize=10&keyword=深圳&status[]=1&status[]=2
  // repeat -----> ?pageNum=1&pageSize=10&keyword=深圳&status=1&status=2
  return qs.stringify(params, { arrayFormat: 'repeat' })
}
const config = {
  params,
  paramsSerializer, // 在拦截器中已配置默认值（默认值同上），在业务中通常不需要重写
}

http.get('/xxx', config)
http.delete('/xxx', config)
http.post('/xxx', null, config)
http.put('/xxx', null, config)
```

#### Request Payload：application/json

```ts
import http from '@/scripts/http'

const data: object /* json 对象 */ = {
  //...
}
const config = { data }

http.get('/xxx', config)
http.delete('/xxx', config)
http.post('/xxx', data)
http.put('/xxx', data)
```

#### Form Data：application/x-www-form-urlencoded

```ts
import http from '@/scripts/http'
import qs from 'qs'

const data: string = qs.stringify({
  // ...
})
const config = { data }

http.get('/xxx', config)
http.delete('/xxx', config)
http.post('/xxx', data)
http.put('/xxx', data)
```

#### Form Data：multipart/form-data

```ts
import http from '@/scripts/http'
import { toFormData } from '@/scripts/utils'

const data: FormData = toFormData({
  // ...
})
const config = { data }

http.get('/xxx', config)
http.delete('/xxx', config)
http.post('/xxx', data)
http.put('/xxx', data)
```

---

### 响应行为处理

#### 在拦截器中

在拦截器中`做好数据及状态的传递以及异常处理`，在业务中不需要有多余的判断或行为，让业务更专注

- 在业务中，then 不需要进行 `res.data.code == 'xxx'` 等多余的操作（交给拦截器）
- 在业务中，catch 不需要处理弹出消息层（交给拦截器）
- ...

#### 在请求方法中

```js
import http from '@/scripts/http'

export const getXxx = function() {
  return http.get('/xxx', {
    exNoErrorMassage: true, // 告诉拦截器响应异常时不要弹出消息层
    exShowLoading: true, // 告诉拦截器请求过程中显示全局 loading
  })
}
```

#### 在业务中 --- 使用 .then .catch .finally

```js
import { getXxx } from '@/scripts/api/common'

export default {
  methods: {
    /* 成功 & 失败 & 完成 */
    getData() {
      this.loading = true
      return getXxx()
        .then(({ exData: data }) => {
          // ...
          this.isError = false
        })
        .catch(error => {
          this.isError = true
          throw error // 一定要抛出异常!!!（让全局统一处理）
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
```

#### 在业务中 --- 使用 async await（推荐）

```js
import { getXxx } from '@/scripts/api/common'

export default {
  methods: {
    /* 成功 */
    async getData1() {
      const { exData: data } = await getXxx()
      // ...
    },

    /* 成功 & 完成 */
    async getData2() {
      try {
        this.loading = true
        const { exData: data } = await getXxx()
        // ...
      } finally {
        this.loading = false
      }
    },

    /* 成功 & 失败 */
    async getData3() {
      try {
        this.loading = true
        const { exData: data } = await getXxx()
        // ...
        this.loading = false
        this.isError = false
      } catch (error) {
        this.loading = false
        this.isError = true
        throw error // 一定要抛出异常!!!（让全局统一处理）
      }
    },

    /* 成功 & 失败 & 完成 */
    async getData4() {
      try {
        this.loading = true
        const { exData: data } = await getXxx()
        // ...
        this.isError = false
      } catch (error) {
        this.isError = true
        throw error // 一定要抛出异常!!!（让全局统一处理）
      } finally {
        this.loading = false
      }
    },
  },
}
```
