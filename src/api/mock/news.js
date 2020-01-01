import { mock } from 'mockjs'

export const news = function(opts, query) {
  const { pageNum = 1, pageSize = 10 } = query
  return mock({
    code: 200,
    data: {
      pageNum,
      pageSize,
      total: 2,
      'list|2': [
        {
          createDate: '@date("yyyy-MM-dd")',
          title: '@csentence(3, 5)',
        },
      ],
    },
  })
}

export const newsDetails = function() {
  return mock({
    code: 200,
    data: {
      createDate: '@date("yyyy-MM-dd")',
      title: '@csentence(3, 5)',
      details: '@cparagraph(2, 3)',
    },
  })
}
