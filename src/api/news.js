import http from '@/scripts/http'

/**
 * 获取新闻列表
 * @param {object} [query]
 * @param {string} [query.keyword]
 * @param {number | string | Array<number | string>} [query.status]
 * @param {number | string} [query.pageNum]
 * @param {number | string} [query.pageSize]
 */
export const getNewsList = query => {
  const params = {
    pageNum: 1,
    pageSize: 10,
    ...query,
  }
  return http.get('/news/getList', { params })
}

/**
 * 获取新闻详情
 * @param {string} id
 */
export const getNewsDetails = id => http.get(`/news/getDetails/${id}`)
