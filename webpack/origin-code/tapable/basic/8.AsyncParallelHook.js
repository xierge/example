/*
 * @Date: 2023-05-24 15:12:59
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-25 17:51:51
 * @FilePath: /example/webpack/origin-code/tapable/basic/8.AsyncParallelHook.js
 * @description: AsyncParallelHook
 */
// 异步并行钩子，会并发执行所有异步钩子
const { AsyncParallelHook } = require("tapable");

const hook = new AsyncParallelHook(["a"]);

console.time("timer");

hook.tapPromise("tapPromise", (a) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("tapPromise", a);
      resolve(111);
    }, 2000);
  });
});

hook.tapAsync("tapAsync", (a, callback) => {
  setTimeout(() => {
    console.log("tapAsync", a); // tapAsync  111
    callback();
  }, 1000);
});

hook.callAsync("arg1", () => {
  console.timeEnd("timer"); // 2
  console.log("Ending~");
});
