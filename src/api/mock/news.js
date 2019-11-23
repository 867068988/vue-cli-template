import { mock } from 'mockjs'

export const news = function() {
  return mock({
    code: 200,
    data: {
      page: 1,
      pageSize: 10,
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
