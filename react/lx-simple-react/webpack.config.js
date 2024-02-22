/*
 * @Date: 2024-02-20 11:56:05
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-21 19:43:02
 * @FilePath: /lx-simple-react/webpack.config.js
 * @description:
 */

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["./dist"],
    }),
    // 指定HTML模板, 插件会将构建好的js文件自动插入到HTML文件中
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    // 指定开发环境应用运行的根据目录
    contentBase: "./dist",
    // 指定控制台输出的信息
    stats: "errors-only",
    // 不启动压缩
    compress: false,
    open: true,
    hot: true,
  },
  mode: "development",
};
