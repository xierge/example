const { SyncHook } = require("tapable");

class Compiler {
  constructor(webpackOptions) {
    this.options = webpackOptions;
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
    let entry = {};
    if (typeof this.options.entry === "string") {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }
    callback();
  }
}

function webpack(webpackOptions) {
  const compiler = new Compiler(webpackOptions);

  const { plugins = [] } = webpackOptions;
  for (let plugin of plugins) {
    plugin.apply(compiler);
  }
  return compiler;
}

module.exports = webpack;
