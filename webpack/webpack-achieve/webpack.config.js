const { Configuration } = require("webpack");
const path = require("path");
const { loader1, loader2 } = require("./loader");
const { WebapckRunPlugin, WebpackDonePlugin } = require("./plugin");
// const { loader1, loader2 } = require('./loader');
/**
 * @type {Configuration} webapck配置相关提示
 */
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new WebapckRunPlugin(), new WebpackDonePlugin()],
  rules: [
    {
      test: /\.js$/,
      use: [loader1, loader2],
    },
  ],
  devtool: "source-map",
  mode: "development",
};
