module.exports = {
  root: true,
  env: {
    browser: true
    // jquery: true
  },
  globals: {},

  extends: ["eslint:recommended"],
  plugins: ["html", "prettier"],
  rules: {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "no-empty": "warn",
    "prettier/prettier": "warn"
  }
};
