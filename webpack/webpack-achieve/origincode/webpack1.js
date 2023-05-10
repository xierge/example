/*
 * @Author: 李鹏玺 2899952565@qq.com
 * @Date: 2023-05-05 16:20:58
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-06 18:38:01
 * @FilePath: /webpack-achieve/origincode/webpack1.js
 * @Description: 搭建结构，读取配置参数
 */

class Compiler {
  constructor() { }

  run(callback) { }
}

//第一步：搭建结构，读取配置参数，这里接受的是webpack.config.js中的参数
function webpack(webpackOptions) {
  const compiler = new Compiler();
  return compiler;
}

module.exports = webpack;
