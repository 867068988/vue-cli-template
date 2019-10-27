module.exports = {
  root: true,
  env: {
    browser: true
    // jquery: true
  },
  globals: {},

  extends: ["eslint:recommended"],

  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error"
  }
};
