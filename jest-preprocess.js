/* eslint-disable import/no-extraneous-dependencies */
const babelOptions = {
  presets: ["babel-preset-gatsby"],
  plugins: ["styled-jsx/babel-test"],
}

module.exports = require("babel-jest").createTransformer(babelOptions)
