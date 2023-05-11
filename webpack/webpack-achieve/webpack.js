/*
 * @Author: 李鹏玺 2899952565@qq.com
 * @Date: 2023-05-06 11:02:37
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-11 14:22:17
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
// 将 code 转换成 ast
const parser = require("@babel/parser");
// node 节点对象
const tarverse = require("@babel/traverse").default;
// 根据 ast 生成代码
const generator = require("@babel/generator").default;
// 修改语法结构，把依赖的模块改为依赖`模块 id` require("./name")=>require("./src/name.js")
const types = require("@babel/types");

// 获取当前目录
const baseDir = process.cwd();

/**
 * @description: 整个编译过程的管家
 */
class Compiler {
  constructor(options) {
    // webpack.config.js 配置参数
    this.options = options;

    // 钩子函数 表示生命周期
    this.hooks = {
      run: new SyncHook(), // 编译开始运行
      done: new SyncHook(), // 编译结束运行
    };
  }
  run(callback) {
    // 开始编译
    this.hooks.run.call();

    /**
     * @description: 对于文件进行编译，监听文件变化重新编译
     * @param {*} error 代码执行错误
     * @param {*} stats
     * @param {*} fileDependencies 本次打包涉及到的文件
     * @return {*}
     */
    const onCompiled = (error, stats, fileDependencies) => {
      // 将编译后的代码写入文件
      for (const fileName in stats.assets) {
        let filePath = path.posix.join(this.options.output.path, fileName);
        fs.writeFileSync(filePath, stats.assets[fileName], "utf-8");
      }

      // 执行 run 函数的回调函数
      callback(error, {
        toJson: () => stats,
      });

      // 对文件进行监听，变化了重新编译
      fileDependencies.forEach((fileDependencie) => {
        fs.watch(fileDependencie, () => this.compile(onCompiled));
      });

      // 编译结束
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
 * @description: 编译核心类
 */
class Compilation {
  constructor(options) {
    // webpack.config.js 配置参数
    this.options = options;
    // 编译所有生成出来的模块
    this.modules = [];
    // 本次打包涉及到的文件，这里主要是为了实现watch模式下监听文件的变化，文件发生变化后会重新编译
    this.fileDependencies = [];
    // 编译产出的所有代码块，入口模块和依赖的模块打包在一起为代码块
    this.chunks = [];
    // 编译产出的资源文件
    this.assets = {};
  }

  build(callback) {
    // 刘思齐老师给的灵感   入口文件：对单文件和多文件统一格式
    let entryFile =
      typeof this.options.entry === "string"
        ? { main: this.options.entry }
        : this.options.entry;

    // 多入口进行循环
    for (let entryName in entryFile) {
      // 获取文件的绝对路径
      let entryFilePath = path.posix.resolve(baseDir, entryFile[entryName]);
      // 将入口文件路径添加到文件依赖中
      this.fileDependencies.push(entryFilePath);
      // 对入口文件进行打包
      let entryModule = this.buildModule(entryName, entryFilePath);
      // 将入口文件添加到 modules 中
      this.modules.push(entryModule);

      // 生成chunk
      let chunk = {
        name: entryName,
        entryModule,
        modules: this.modules.filter((item) => item.names.includes(entryName)),
      };
      // 添加到 chunk 中
      this.chunks.push(chunk);
    }
    // 对chunks进行循环，生成代码
    this.chunks.forEach((chunk) => {
      let fileName = this.options.output.filename.replace("[name]", chunk.name);
      this.assets[fileName] = getSource(chunk);
    });

    // onCompiled 函数执行，生成文件
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
    // 获取文件的源代码
    let sourceCode = fs.readFileSync(filePath, "utf-8");
    // 获取文件的 moduleId
    let moduleId = "./" + path.posix.relative(baseDir, filePath);

    let module = {
      id: moduleId,
      names: [name], // names设计成数组是因为代表的是此模块属于哪个代码块，可能属于多个代码块
      _source: "", // 该模块的代码信息
      dependencies: [], // 依赖的模块
    };

    // loader，匹配当前文件打包所需要的loader
    let { rules = [] } = this.options;
    let loaders = [];
    for (const rule of rules) {
      const { test } = rule;
      if (filePath.match(test)) {
        loaders.push(...rule.use);
      }
    }
    // 依次执行 loader
    sourceCode = loaders?.reduceRight(
      (code, loader) => loader(code),
      sourceCode
    );

    // 把源代码编译成 [AST](https://astexplorer.net/)
    let ast = parser.parse(sourceCode, {
      sourceType: "module",
    });

    tarverse(ast, {
      CallExpression: (nodePath) => {
        const { node } = nodePath;
        // 在 `AST` 中查找 `require` 语句，找出依赖的模块名称和绝对路径
        if (node.callee.name === "require") {
          // 获取依赖的模块
          let depModuleName = node.arguments[0].value;

          let dirname = path.posix.dirname(filePath);
          // 获取依赖文件的绝对路径
          let depModulePath = path.posix.resolve(dirname, depModuleName);
          // 获取 webpack.config.js 文件中配置的 resolve.extensions 属性
          let extensions = this.options.resolve?.extensions || [".js"];
          // 将路径后缀名拼接完整
          depModulePath = tryExtensions(depModulePath, extensions);
          // 获取文件相对路径
          let depModuleId = "./" + path.posix.relative(baseDir, depModulePath);
          // 修改语法结构，把依赖的模块改为依赖`模块 id`   例: require("./name")=>require("./src/name.js")
          node.arguments = [types.stringLiteral(depModuleId)];
          // 将依赖模块的信息 push 到该模块的 `dependencies` 属性中
          module.dependencies.push({ depModuleId, depModulePath });
        }
      },
    });

    // 将 ast 转化为 code，并且把转译后的源代码放到 `module._source` 属性上
    let { code } = generator(ast);
    module._source = code;

    // 对依赖模块进行编译（对 `module 对象`中的 `dependencies` 进行递归执行 `buildModule` ）
    module.dependencies.forEach(({ depModuleId, depModulePath }) => {
      // 考虑到多入口打包 ：一个模块被多个其他模块引用，不需要重复打包
      let existModule = this.modules.find((item) => item.id === depModuleId);
      // 如果modules里已经存在这个将要编译的依赖模块了，那么就不需要编译了，直接把此代码块的名称添加到对应模块的names字段里就可以
      if (existModule) {
        existModule.names.push(name);
      } else {
        // 对依赖模块编译完成后得到依赖模块的 `module 对象`，push 到 `this.modules` 中
        let depModule = this.buildModule(name, depModulePath);
        this.modules.push(depModule);
      }
    });

    return module;
  }
}

/**
 * @description: 补全文件扩展名 例： .js
 * @param {*} path 路径
 * @param {*} extensions 扩展名
 * @return {*}
 */
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

/**
 * @description: 生成运行时代码
 * @param {*} chunk
 * @return {*} source_codes
 */
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

/**
 * @description: webpack 入口函数
 * @param {*} webpackOptions webpack 配置
 * @return {*} compiler 实例
 */
module.exports = function webpack(webpackOptions) {
  // 初始化 compiler 实例
  const compiler = new Compiler(webpackOptions);

  // 获取插件
  const { plugins = [] } = webpackOptions;

  // 根据插件的生命周期钩子函数在compiler对应钩子注册事件
  for (const plugin of plugins) {
    plugin.apply(compiler);
  }

  return compiler;
};
