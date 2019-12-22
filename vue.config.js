const { join } = require('path')
const env = process.env
const isDev = env.NODE_ENV === 'development'
const isCssAutoprefixer = isDev ? env.DEV_CSS_AUTOPREFIXER === 'true' : true
const svgSpriteIconsDir = join(__dirname, './src/components/SvgIcon/icons/')

/* 当代理的前缀为空时 */
if (isDev) {
  const isEmpty = prefix => prefix === '' || prefix === '/'
  if (isEmpty(env.VUE_APP_BASEURL_XXX)) env.VUE_APP_BASEURL_XXX = '/@XXX'
  if (isEmpty(env.VUE_APP_BASEURL_YYY)) env.VUE_APP_BASEURL_YYY = '/@YYY'
}

module.exports = Object.assign({
  devServer: {
    /* 更详细的配置规则：https://webpack.docschina.org/configuration/dev-server/#devserver-proxy */
    proxy: {
      [env.VUE_APP_BASEURL_XXX]: {
        pathRewrite: { '^/@XXX': '' },
        target: env.DEV_PROXY_TARGET_XXX,
        changeOrigin: true,
      },
      [env.VUE_APP_BASEURL_YYY]: {
        pathRewrite: { '^/@YYY': '' },
        target: env.DEV_PROXY_TARGET_YYY,
        changeOrigin: true,
      },
    },
  },

  publicPath: env.BASE_URL || '/',

  css: {
    sourceMap: isDev
      ? env.DEV_CSS_SOURCEMAP === 'true'
      : env.VUE_APP_ENV === 'stage',
    loaderOptions: {
      postcss: { ...(!isCssAutoprefixer && { autoprefixer: null }) },
    },
  },

  productionSourceMap: env.VUE_APP_ENV === 'stage',

  configureWebpack: config => {
    if (isDev) config.devtool = 'source-map'
    config.module.rules.push({
      test: /\.svg$/,
      include: svgSpriteIconsDir,
      use: [
        {
          loader: 'svg-sprite-loader',
          options: { symbolId: '$svgSpriteIcon_[name]' },
        },
        'svgo-loader',
      ],
    })
  },

  chainWebpack: config => {
    config.module.rule('svg').exclude.add(svgSpriteIconsDir)
    if (config.plugins.has('copy')) {
      config.plugin('copy').tap(args => {
        args[0][0].ignore.push('.eslintrc.js', '.prettierrc.js')
        return args
      })
    }
  },
})

if (env.NODE_ENV) {
  if (
    !/^(development|production|test)$/.test(env.NODE_ENV) ||
    !/^(dev|stage|prod)$/.test(env.VUE_APP_ENV) ||
    (env.NODE_ENV === 'development' && env.VUE_APP_ENV !== 'dev') ||
    (env.NODE_ENV === 'production' && env.VUE_APP_ENV === 'dev') ||
    (env.NODE_ENV === 'production' && env.VUE_APP_MOCK === undefined)
  ) {
    throw new Error('环境变量配置错误或不兼容或缺失')
  }
}
