/*
 * @Date: 2023-05-24 15:12:59
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-25 17:51:54
 * @FilePath: /example/webpack/origin-code/tapable/basic/9.AsyncParallelBailHook.js
 * @description: AsyncParallelBailHook
 */
// 异步并行保险钩子
const { AsyncParallelBailHook } = require("tapable");

const hook = new AsyncParallelBailHook(["a"]);

console.time("timer");

hook.tapPromise("tapPromise", (a) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("tapPromise", a);
      resolve(true);
      // 阻断 Ending～
    }, 1000);
  });
});

hook.tapAsync("tapAsync", (a, callback) => {
  setTimeout(() => {
    console.log("tapAsync", a);
    callback();
  }, 2000);
});

hook.callAsync("arg1", () => {
  console.timeEnd("timer"); // 2
  console.log("Ending~");
});
