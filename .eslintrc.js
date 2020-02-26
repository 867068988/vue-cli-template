module.exports = {
  root: true,
  env: { node: true },

  extends: [
    'plugin:vue/strongly-recommended', // 使用严谨模式
    'eslint:recommended',
    '@vue/prettier', // 结合 .prettierrc.js
  ],

  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-unused-vars': [
      'warn',
      { ignoreRestSiblings: true /* 解构剩余变量时不检查 */ },
    ],
    'vue/no-unused-components': 'warn',
    'no-empty': 'off',
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
