module.exports = {
  root: true,
  env: {
    browser: true
    // jquery: true
  },
  globals: {},

  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended" // .prettierrc.js 需要重置为空 (按默认配置)
  ]
};
