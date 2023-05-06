/*
 * @Author: 李鹏玺 2899952565@qq.com
 * @Date: 2023-05-05 16:21:03
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-06 18:40:03
 * @FilePath: /webpack-achieve/origincode/webpack2.js
 * @Description: 用配置参数对象初始化 Compiler 对象
 */
const { SyncHook } = require("tapable");

class Compiler {
  constructor(webpackOptions) {
    // 储存配置信息
    this.options = webpackOptions;

    // 初始化钩子函数
    this.hooks = {
      run: new SyncHook(), // 开始编译触发
      done: new SyncHook(), // 编辑结束时出发
    };
  }

  run(callback) {}
}

function webpack(webpackOptions) {
  //第二步：用配置参数对象初始化 `Compiler` 对象
  const compiler = new Compiler(webpackOptions);
  return compiler;
}

module.exports = webpack;
