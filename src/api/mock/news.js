import { mock } from 'mockjs'

export const getList = function(opts, query) {
  const { pageNum, pageSize } = query
  return mock({
    code: 200,
    data: {
      pageNum: Number(pageNum) || 1,
      pageSize: Number(pageSize) || 10,
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

export const getDetails = function() {
  return mock({
    code: 200,
    data: {
      createDate: '@date("yyyy-MM-dd")',
      title: '@csentence(3, 5)',
      details: '@cparagraph(2, 3)',
    },
  })
}
