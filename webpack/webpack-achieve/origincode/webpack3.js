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

function webpack(webpackOptions) {
  const compiler = new Compiler(webpackOptions);

  // 加载插件
  const { plugins = [] } = webpackOptions;
  for (let plugin of plugins) {
    plugin.apply(compiler);
  }
  return compiler;
}

module.exports = webpack;
