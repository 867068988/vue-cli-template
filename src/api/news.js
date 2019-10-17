import http from '@/scripts/http'

/**
 * 获取新闻列表
 * @param {Object} [query]
 * @param {string} [query.type] 分类
 * @param {string} [query.keyword] 关键词
 * @param {string} [query.page] 当前是第几页
 * @param {string} [query.pageSize] 每页多少条记录
 */
export const getNews = query => {
  const params = {
    page: 1,
    pageSize: 10,
    ...query,
  }
  return http.get('/news', { params })
}

/**
 * 获取新闻详情
 * @param {string} id 新闻 id
 */
export const getNewsDetails = id => http.get(`/news/details/${id}`)
