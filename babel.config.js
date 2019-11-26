module.exports = {
  presets: ['@vue/app'],

  plugins: [
    /* element-ui 按需引入，详情：https://element.eleme.cn/#/zh-CN/component/quickstart */
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk', // 单独引用主题包时，把该行替换为 style: false
      },
    ],

    /* lodash 按需引入，详情：https://github.com/lodash/babel-plugin-lodash#example */
    ['lodash'],
  ],
}
