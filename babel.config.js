module.exports = {
  presets: ['@vue/app'],

  plugins: [
    /* element-ui 按需引入，详情：https://element.eleme.cn/#/zh-CN/component/quickstart#an-xu-yin-ru */
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],

    /* lodash 按需引入，详情：https://github.com/lodash/babel-plugin-lodash#example */
    ['lodash'],
  ],
}
