/**
 * 静态资源服务 (node 运行)
 * 通常用于在浏览器中预览 dist 目录
 */

const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { join } = require('path')
const os = require('os')
const open = require('open')

const BASE_URL = '/' // 打包时的 process.env.BASE_URL
const port = 8181
const isHistoryMode = false
const projectDir = join(__dirname, './dist')
const app = express()

/* 代理，更详细的配置规则：https://github.com/chimurai/http-proxy-middleware#options */
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://10.25.73.159:8081',
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

/* 启动 */
app.listen(port, function() {
  const ip = (() => {
    const interfaces = os.networkInterfaces()
    for (let devName in interfaces) {
      const iface = interfaces[devName]
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i]
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          return alias.address
        }
      }
    }
  })()
  const url = `http://${ip || 'localhost'}:${port}${BASE_URL}`
  global.console.log(`\n Page: ${url} \n`)
  open(url)
})
