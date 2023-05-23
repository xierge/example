/*
 * @Date: 2023-05-23 23:51:06
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-24 00:52:50
 * @FilePath: /example/webpack/origin-code/webpack4/webpack.config.js
 * @description: 
 */
const { Configuration } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const RemoveComment = require("./plugin/removeComment")
const path = require("path")
/**
 * @type {Configuration} webpack相关提示
 */
module.exports = {
    entry: "../src/index.js",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: "development",
    devtool: false,
    plugins: [
        new HtmlWebpackPlugin({
            template: "../src/index.html",
        }),
        new RemoveComment()
    ]
}