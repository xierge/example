const { SyncHook } = require("tapable");

class Compiler {
  constructor(webpackOptions) {
    // 储存配置信息
    this.options = webpackOptions;

    // 初始化钩子函数
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    };
  }

  run(callback) {}
}

//第一步：搭建结构，读取配置参数，这里接受的是webpack.config.js中的参数
function webpack(webpackOptions) {
  const compiler = new Compiler(webpackOptions);
  return compiler;
}

module.exports = webpack;
