const { SyncHook } = require("tapable");
const path = require("path");
const fs = require("fs");
const parser = require("@babel/parser");
const tarverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const types = require("@babel/types");
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
    const onCompiled = (err, stats, fileDependencies) => {
      for (let filename in stats.assets) {
        let filePath = path.join(this.options.output.path, filename);
        fs.writeFileSync(filePath, stats.assets[filename], "utf8");
      }

      callback(err, {
        toJson: () => stats,
      });

      fileDependencies.forEach((fileDependencie) => {
        fs.watch(fileDependencie, () => this.compile(onCompiled));
      });

      this.hooks.done.call();
    };
    this.compile(onCompiled);
  }

  compile(callback) {
    const compilation = new Compilation(this.options);
    compilation.build(callback);
  }
}

/**
 * @return {string} filePath 文件路径
 * @description:
 */
// 获取文件的完整的路径
function tryExtensions(modluePath, extensions) {
  if (fs.existsSync(modluePath)) {
    return;
  }

  for (let i = 0; i < extensions?.length; i++) {
    let filePath = modluePath + extensions[i];
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  throw new Error(`无法找到${modulePath}`);
}

class Compilation {
  constructor(webpackOptions) {
    this.options = webpackOptions;
    this.modules = [];
    this.chunks = [];
    this.assets = {};
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
      this.modules.push(entryModule);
      let chunk = {
        name: entryName,
        entryModule,
        modules: this.modules.filter((item) => item.names.includes(entryName)),
      };
      this.chunks.push(chunk);
    }

    this.chunks.forEach((chunk) => {
      let fileName = this.options.output.filename.replace("[name]", chunk.name);
      this.assets[fileName] = getSource(chunk);
    });

    callback(
      null,
      {
        chunks: this.chunks,
        modules: this.modules,
        assets: this.assets,
      },
      this.fileDependencies
    );
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
    // 第七步：找出此模块所依赖的模块，再对依赖模块进行编译
    // 7.1 先把源代码编译成 [AST](https://astexplorer.net/)
    let ast = parser.parse(sourceCode, { sourceType: "module" });

    tarverse(ast, {
      CallExpression: (nodePath) => {
        const { node } = nodePath;
        // 7.2：在 `AST` 中查找 `require` 语句，找出依赖的模块名称和绝对路径
        if (node.callee.name === "require") {
          // 获取依赖的模块
          let depModuleName = node.arguments[0].value;

          // 获取当前正在编译的模所在的目录
          let dirname = path.posix.dirname(modulePath);

          // 获取依赖模块的绝对路径
          let depModulePath = path.posix.join(dirname, depModuleName);

          // 获取配置中的extensions
          let extensions = this.options.resolve?.extensions || [".js"];

          //尝试添加后缀，找到一个真实在硬盘上存在的文件
          depModulePath = tryExtensions(depModulePath, extensions);

          // 7.3：将依赖模块的绝对路径 push 到 `this.fileDependencies` 中
          this.fileDependencies.push(depModulePath);

          // 7.4：生成依赖模块的`模块 id`
          let depModuleId = "./" + path.posix.relative(baseDir, depModulePath);

          // 7.5：修改语法结构，把依赖的模块改为依赖`模块 id` require("./name")=>require("./src/name.js")
          node.arguments = [types.stringLiteral(depModuleId)];

          // 7.6：将依赖模块的信息 push 到该模块的 `dependencies` 属性中
          module.dependencies.push({ depModuleId, depModulePath });
        }
      },
    });

    // 7.7：生成新代码，并把转译后的源代码放到 `module._source` 属性上
    let { code } = generator(ast);
    module._source = code;

    // 7.8：对依赖模块进行编译（对 `module 对象`中的 `dependencies` 进行递归执行 `buildModule` ）
    module.dependencies.forEach(({ depModuleId, depModulePath }) => {
      let existModule = this.modules.find((item) => item.id === depModuleId);
      if (existModule) {
        existModule.names.push(name);
      } else {
        // 7.9：对依赖模块编译完成后得到依赖模块的 `module 对象`，push 到 `this.modules` 中
        let depModule = this.buildModule(name, depModulePath);
        this.modules.push(depModule);
      }
    });
    // 7.10：等依赖模块全部编译完成后，返回入口模块的 `module` 对象
    return module;
  }
}

//生成运行时代码
function getSource(chunk) {
  return `
     (() => {
      var modules = {
        ${chunk.modules.map(
          (module) => `
          "${module.id}": (module) => {
            ${module._source}
          }
        `
        )}  
      };
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = (cache[moduleId] = {
          exports: {},
        });
         modules[moduleId](module, module.exports, require);
        return module.exports;
      }
       var exports ={};
       ${chunk.entryModule._source}
     })();
      `;
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
