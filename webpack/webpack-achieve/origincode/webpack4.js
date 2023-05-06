/*
 * @Author: 李鹏玺 2899952565@qq.com
 * @Date: 2023-05-05 16:52:06
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-06 18:50:33
 * @FilePath: /webpack-achieve/origincode/webpack4.js
 * @Description: 执行Compiler对象的run方法开始执行编译
 */
const { SyncHook } = require("tapable");

//Compiler其实是一个类，它是整个编译过程的大管家，而且是单例模式
class Compiler {
  constructor(webpackOptions) {
    this.options = webpackOptions;
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    };
  }

  // 第四步：执行`Compiler`对象的 run 方法开始执行编译
  run(callback) {
    this.hooks.run.call();
    const onCompiled = () => {
      this.hooks.done.call();
    };
    this.compile(onCompiled);
  }

  compile(callback) {
    const compilation = new Compilation(this.options);

    // 执行compilation的build方法进行编译，编译成功之后执行回调
    compilation.build(callback);
  }
}

class Compilation {
  constructor(webpackOptions) {
    this.options = webpackOptions;

    // 本次编译所有生成出来的模块
    this.module = [];

    // 本次编译产出的所有代码块，入口模块和依赖的模块打包在一起为代码块
    this.chunks = [];

    // 本次编译产出的资源文件
    this.assets = {};

    // 本次打包涉及到的文件，这里主要是为了实现watch模式下监听文件的变化，文件发生变化后会重新编译
    this.fileDependencies = [];
  }

  build(callback) {
    // 这里开始做编译工作，编译成功执行callback
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
