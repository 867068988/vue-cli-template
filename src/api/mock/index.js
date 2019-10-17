/* 官方示例：http://mockjs.com/examples.html */

import createMock from './createMock'
import * as news from './news'

const myMock = createMock(process.env.VUE_APP_BASEURL_XXX)

/* 统一在这里注册 */
myMock('reg:/news(\\?.*)?', news.news)
myMock('reg:/news/details/.+', news.newsDetails)
