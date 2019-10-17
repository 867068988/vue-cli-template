/**
 * 静态资源服务 (node 运行)
 * 通常用于在浏览器中预览 dist 目录
 */

const express = require('express')
const proxy = require('http-proxy-middleware')
const opn = require('opn')
const { join } = require('path')

const BASE_URL = '/' // 打包时的 process.env.BASE_URL
const projectDir = join(__dirname, './dist')
const isHistoryMode = false
const app = express()

/* 代理，更详细的配置规则：https://github.com/chimurai/http-proxy-middleware#options */
app.use(
  '/baseUrlXxx',
  proxy({
    target: 'http://10.25.73.159:8081',
    changeOrigin: true,
  }),
)
app.use(
  '/baseUrlYyy',
  proxy({
    target: 'http://10.25.73.159:8082',
    changeOrigin: true,
  }),
)

/* 静态资源 */
app.use(BASE_URL, function(req, res) {
  let sendfilePath = req.path
  let cacheControl = 'no-cache'
  const isStatic = /\.\w+$/.test(req.path)
  const isHomePageStatic = /^\/index\.html/.test(req.path)
  const isHashCache = /^\/(css|js|img|fonts)\//.test(req.path)
  if (isStatic) {
    if (isHomePageStatic) {
      cacheControl = 'no-store'
    } else if (isHashCache) {
      cacheControl = 'public,max-age=31536000'
    }
  } else {
    if (isHistoryMode) {
      cacheControl = 'no-store'
      sendfilePath = '/index.html'
    } else {
      if (req.path === '/') {
        cacheControl = 'no-store'
      }
      sendfilePath = req.path + '/index.html'
    }
  }
  res.setHeader('Cache-Control', cacheControl)
  res.sendfile(
    join(projectDir, sendfilePath),
    err => err && res.status(err.status).send(err.status),
  )
})
app.use((req, res) => res.status(404).send(404))

app.listen(8181, function() {
  const url = `http://localhost:8181${BASE_URL}`
  global.console.log(`\n Page: ${url} \n`)
  opn(url)
})
