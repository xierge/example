const { SyncHook } = require("tapable");
const path = require("path");
const fs = require("fs");
function toUnixPath(path) {
  return path.replace(/\\/g, "/");
}

const baseDir = toUnixPath(process.cwd());

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

    for (let entryName in entry) {
      let entryFilePath = path.posix.join(baseDir, entry[entryName]);
      this.fileDependencies.push(entryFilePath);
      let entryModule = this.buildModule(entryName, entryFilePath);
      this.module.push(entryModule);
    }
    callback();
  }

  buildModule(name, modulePath) {
    let sourceCode = fs.readFileSync(modulePath, "utf-8");

    let moduleId = "./" + path.posix.relative(baseDir, modulePath);

    let module = {
      id: moduleId,
      names: [name],
      dependencies: [],
      _source: "",
    };
    let loaders = [];

    let { rules = [] } = this.options;

    rules.forEach((rule) => {
      let { test } = rule;
      if (modulePath.match(test)) {
        loaders.push(...rule.use);
      }
    });

    sourceCode = loaders?.reduceRight(
      (code, loader) => loader(code),
      sourceCode
    );

    return module;
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
