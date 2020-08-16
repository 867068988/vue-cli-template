import http from '@/scripts/http'

/**
 * 获取新闻列表
 * @param {object} [params]
 * @param {string =} params.keyword
 * @param {number | string | Array<number | string> =} params.status
 * @param {number | string =} params.pageNum
 * @param {number | string =} params.pageSize
 */
export const getNewsList = params => {
  params = {
    pageNum: 1,
    pageSize: 10,
    ...params,
  }
  return http.get('/news/getList', { params })
}

/**
 * 获取新闻详情
 * @param {string} id
 */
export const getNewsDetails = id => http.get(`/news/getDetails/${id}`)
