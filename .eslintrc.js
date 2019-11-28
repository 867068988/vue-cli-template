module.exports = {
  root: true,
  env: { node: true },

  extends: [
    'plugin:vue/strongly-recommended', // 使用严谨模式
    '@vue/prettier', // 结合 .prettierrc.js
  ],

  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: { jest: true },
    },
  ],
}
