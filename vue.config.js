const autoprefixer = require('autoprefixer')
const postcssPxtorem = require('postcss-pxtorem') // @H5 将 px 转成 rem
const _ = require('lodash')
const { join } = require('path')
const env = process.env
const isDev = env.NODE_ENV === 'development'

/* 当代理的前缀为空时 */
if (isDev) {
  const isEmpty = prefix => prefix === '' || prefix === '/'
  if (isEmpty(env.VUE_APP_BASEURL_API)) env.VUE_APP_BASEURL_API = '/@API'
}

module.exports = Object /* 防止 GUI 改写配置 */.assign({
  devServer: {
    /* 更详细的配置规则：https://webpack.docschina.org/configuration/dev-server/#devserver-proxy */
    proxy: {
      [env.VUE_APP_BASEURL_API]: {
        pathRewrite: { '^/@API': '' },
        target: env.DEV_PROXY_TARGET_API,
      },
    },
  },

  assetsDir: 'static-hash',

  publicPath: env.BASE_URL || '/',

  css: {
    loaderOptions: {
      postcss: {
        plugins: function({ resourcePath: path }) {
          const pxtorem = postcssPxtorem({ propList: ['*'] }) // @H5 将 px 转成 rem
          if (
            /* 跳过 autoprefixer */
            /[\\/]node_modules[\\/].+\.css$/.test(path) ||
            /[\\/]src[\\/]libs[\\/].+\.css$/.test(path) ||
            (isDev && env.DEV_CSS_AUTOPREFIXER !== 'true')
          ) {
            return [pxtorem]
          }
          return [pxtorem, autoprefixer]
        },
      },
    },

    sourceMap: isDev
      ? env.DEV_CSS_SOURCEMAP === 'true'
      : env.VUE_APP_ENV === 'stage',
  },

  productionSourceMap: env.VUE_APP_ENV === 'stage',

  configureWebpack: config => {
    if (isDev) config.devtool = 'source-map'
    config.optimization.splitChunks.cacheGroups.vendors.test = /[\\/]node_modules[\\/]|[\\/]src[\\/]libs[\\/]/ // 合在一起的 vendors 同步包
  },

  chainWebpack: config => {
    /* 跳过 babel-loader */
    config.module.rule('js').exclude.add(path => {
      return /[\\/]src[\\/]libs[\\/].+\.js$/.test(path)
    })

    const svgSpriteIconsDir = join(__dirname, './src/components/SvgIcon/icons/')
    config.module.rule('svg').exclude.add(svgSpriteIconsDir)
    config.module
      .rule('svg-sprite')
      .after('svg')
      .test(/\.(svg)(\?.*)?$/)
      .include.add(svgSpriteIconsDir)
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: '$svgSpriteIcon_[name]' })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')

    /* @H5.vant */
    const vant = config.module
      .rule('less')
      .oneOf('vant')
      .before('vue-modules')
      .test(/[\\/]node_modules[\\/]vant[\\/]/)
    config.module
      .rule('less')
      .oneOf('normal')
      .toConfig()
      .use.forEach(({ __useName, loader, options = {} }) => {
        const ops = _.cloneDeep(options)
        if (__useName === 'less-loader') {
          ops.modifyVars = {
            hack: `true; @import '${join(__dirname, './src/vant/vars.less')}'`,
          }
        }
        vant
          .use(__useName)
          .loader(loader)
          .options(ops)
      })

    if (config.plugins.has('copy')) {
      config.plugin('copy').tap(args => {
        args[0][0].ignore.push('.eslintrc.js', '.prettierrc.js')
        args[0][0].transform = function(content, path) {
          if (
            /* 让 public 中的其它文件也支持 EJS 语法（传入运行时可用的环境变量） */
            /\.(html|htm|css|js|json)$/.test(path) &&
            /[\\/]public[\\/]libs[\\/]/.test(path) === false
          ) {
            const ejsData = _.pickBy(env, (val, key) =>
              /^(NODE_ENV|BASE_URL|VUE_APP_.*)$/.test(key),
            )
            content = _.template(`${content}`, { sourceURL: path })(ejsData)
          }
          return content
        }
        return args
      })
    }
  },
})

if (env.NODE_ENV) {
  if (
    /^(development|production|test)$/.test(env.NODE_ENV) === false ||
    /^(dev|stage|prod)$/.test(env.VUE_APP_ENV) === false ||
    (env.NODE_ENV === 'development' && env.VUE_APP_ENV !== 'dev') ||
    (env.NODE_ENV === 'production' && env.VUE_APP_ENV === 'dev') ||
    (env.NODE_ENV === 'production' && env.VUE_APP_MOCK === undefined)
  ) {
    throw new Error('环境变量配置错误或不兼容或缺失')
  }
}
