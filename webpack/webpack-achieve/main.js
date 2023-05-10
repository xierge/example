/*
 * @Date: 2023-05-07 21:57:47
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-07 22:05:25
 * @FilePath: /example/webpack/webpack-achieve/main.js
 * @description: 
 */
// const webpack = require('webpack')
const webpack = require("./webpack.js");

const webpackOptions = require("./webpack.config.js");

const compiler = webpack(webpackOptions);

compiler.run((err, stats) => {
  // console.log(err);
  console.log(
    stats.toJson({
      assets: true, //打印本次编译产出的资源
      chunks: true, //打印本次编译产出的代码块
      modules: true, //打印本次编译产出的模块
    })
  );
});
