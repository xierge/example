/*
 * @Author: 李鹏玺 2899952565@qq.com
 * @Date: 2023-05-05 16:41:43
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-06 18:43:06
 * @FilePath: /webpack-achieve/origincode/webpack3.js
 * @Description: 挂载配置文件中的插件
 */
const { SyncHook } = require("tapable");

class Compiler {
  constructor(webpackOptions) {
    this.options = webpackOptions;
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    };
  }

  run(callback) {}
}

function webpack(webpackOptions) {
  const compiler = new Compiler(webpackOptions);

  // 第三步：挂载配置文件中的插件
  const { plugins = [] } = webpackOptions;
  for (let plugin of plugins) {
    plugin.apply(compiler);
  }

  return compiler;
}

module.exports = webpack;
