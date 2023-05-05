const { SyncHook } = require("tapable");
const path = require("path");
const fs = require("fs");
const parser = require("@babel/parser");
const tarverse = require("@babel/traverse").default;
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

function tryExtensions(modluePath, extensions) {
  if (fs.existsSync(modluePath)) {
    return
  }

  for (let i = 0; i < extensions?.length; i++) {
    let filePath = modluePath + extensions[i]
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  throw new Error(`无法找到${modulePath}`)
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
    // 7.1 先把源代码编译成 [AST](https://astexplorer.net/)
    let ast = parser.parse(sourceCode, { sourceType: "module" });

    tarverse(ast, {
      CallExpression: (nodePath) => {
        const { node } = nodePath;
        // 7.2：在 `AST` 中查找 `require` 语句，找出依赖的模块名称和绝对路径
        if (node.callee.name === "require") {
          // 获取依赖的模块
          let depModuleName = node.arguments[0].value;

          let dirname = path.posix.dirname(modulePath);

          let depModulePath = path.posix.join(dirname, depModuleName);

          // 获取配置中的extensions
          let extensions = this.options.resolve?.extensions || ['.js']

          depModulePath = tryExtensions(depModulePath, extensions)

          console.log(depModulePath);
        }
      },
    });

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
