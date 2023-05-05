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

  run(callback) {
    this.hooks.run.call();
    const onCompiled = () => {
      this.hooks.done.call();
    };
    this.compile(onCompiled);
  }

  compile(callback) {
    const compilation = new Compilation(this.options);
    compilation.build(callback);
  }
}

class Compilation {
  constructor(webpackOptions) {
    this.options = webpackOptions;
    this.module = [];
    this.chunks = [];
    this.assets = [];
    this.fileDependencies = [];
  }

  build(callback) {
    callback();
  }
}

function webpack(webpackOptions) {
  const compiler = new Compiler(webpackOptions);

  // 加载 plugin 插件
  const { plugins = [] } = webpackOptions;
  for (let plugin of plugins) {
    plugin.apply(compiler);
  }
  return compiler;
}

module.exports = webpack;
