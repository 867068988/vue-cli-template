import http from '@/scripts/http'

/**
 * 获取新闻列表
 * @param {object} [query]
 * @param {string} [query.type] 分类
 * @param {string} [query.keyword] 关键词
 * @param {string} [query.pageNum] 第几页
 * @param {string} [query.pageSize] 每页多少条
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
 * @param {string} id 新闻 id
 */
export const getNewsDetails = id => http.get(`/news/getDetails/${id}`)
