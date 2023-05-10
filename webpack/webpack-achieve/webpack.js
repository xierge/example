/*
 * @Author: 李鹏玺 2899952565@qq.com
 * @Date: 2023-05-06 11:02:37
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-10 23:11:55
 * @FilePath: /example/webpack/webpack-achieve/webpack.js
 * @Description: 手写 webpack
 */

// 1. 项目初始化
// 2. 搭建结构，读取配置参数
// 3. 用配置参数对象初始化 Compiler 对象
// 4. 挂载配置文件中的插件
// 5. 执行 Compiler 对象的 run 方法开始执行编译
// 6. 根据配置文件中的 entry 配置项找到所有的入口
// 7. 从入口文件出发，调用配置的 loader 规则，对各模块进行编译
// 8. 找出此模块所依赖的模块，再对依赖模块进行编译
// 9. 等所有模块都编译完成后，根据模块之间的依赖关系，组装代码块 chunk
// 10. 把各个代码块 chunk 转换成一个一个文件加入到输出列表
// 11. 确定好输出内容之后，根据配置的输出路径和文件名，将文件内容写入到文件系统

const { SyncHook } = require("tapable");
const path = require("path");
const fs = require("fs");
const parser = require("@babel/parser");
const tarverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const types = require("@babel/types");

const baseDir = process.cwd();
class Compiler {
  constructor(options) {
    this.options = options;

    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    };
  }
  run(callback) {
    this.hooks.run.call();
    // 文件变化后 重新编译
    const onCompiled = (error, stats, fileDependencies) => {
      for (const fileName in stats.assets) {
        let filePath = path.posix.join(this.options.output.path, fileName);
        fs.writeFileSync(filePath, stats.assets[fileName], "utf-8");
      }

      callback(error, {
        toJson: () => stats,
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

class Compilation {
  constructor(options) {
    this.options = options;
    this.modules = [];
    this.fileDependencies = [];
    this.chunks = [];
    this.assets = {};
  }

  build(callback) {
    // 入口文件：对单文件和多文件统一格式
    let entryFile = typeof this.options.enter === "string" ? { main: this.options.enter } : this.options.enter

    for (let entryName in entryFile) {
      let entryFilePath = path.posix.resolve(baseDir, entryFile[entryName]);
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

  buildModule(name, filePath) {
    let sourceCode = fs.readFileSync(filePath, "utf-8");
    let moduleId = "./" + path.posix.relative(baseDir, filePath);

    let module = {
      id: moduleId,
      names: [name],
      _source: "",
      dependencies: [],
    };

    let { rules = [] } = this.options;
    let loaders = [];

    for (const rule of rules) {
      const { test } = rule;
      if (filePath.match(test)) {
        loaders.push(...rule.use);
      }
    }

    sourceCode = loaders?.reduceRight(
      (code, loader) => loader(code),
      sourceCode
    );

    // 转化成ast
    let ast = parser.parse(sourceCode, {
      sourceType: "module",
    });

    tarverse(ast, {
      CallExpression: (nodePath) => {
        const { node } = nodePath;
        if (node.callee.name === "require") {
          let depModuleName = node.arguments[0].value;

          let dirname = path.posix.dirname(filePath);

          let depModulePath = path.posix.resolve(dirname, depModuleName);

          let extensions = this.options.resolve?.extensions || [".js"];

          depModulePath = tryExtensions(depModulePath, extensions);

          let depModuleId = "./" + path.posix.relative(baseDir, depModulePath);

          node.arguments = [types.stringLiteral(depModuleId)];

          module.dependencies.push({ depModuleId, depModulePath });
        }
      },
    });

    let { code } = generator(ast);
    module._source = code;
    module.dependencies.forEach(({ depModuleId, depModulePath }) => {
      let existModule = this.modules.find((item) => item.id === depModuleId);
      if (existModule) {
        existModule.names.push(name);
      } else {
        let depModule = this.buildModule(name, depModulePath);
        this.modules.push(depModule);
      }
    });

    return module;
  }
}

function tryExtensions(path, extensions) {
  if (fs.existsSync(path)) {
    return path;
  }

  for (let i = 0; i < extensions.length; i++) {
    const filePath = path + extensions[i];
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return new Error("无法找到" + path);
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

module.exports = function webpack(webpackOptions) {
  const compiler = new Compiler(webpackOptions);

  // 插件机制
  const { plugins = [] } = webpackOptions;
  // 根据插件的生命周期钩子函数在compiler对应钩子注册事件
  for (const plugin of plugins) {
    plugin.apply(compiler);
  }

  return compiler;
};
