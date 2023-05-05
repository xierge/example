class WebpackDonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap("Web pa c kWebpackDonePlugin", () => {
      console.log("结束编译");
    });
  }
}

module.exports = WebpackDonePlugin;
