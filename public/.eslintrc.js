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
    "no-console": "warn",
    "no-unused-vars": "warn",
    "no-empty": "off",
    "prettier/prettier": "warn"
  }
};
