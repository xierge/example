/*
 * @Date: 2023-05-24 15:12:59
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-25 17:51:41
 * @FilePath: /example/webpack/origin-code/tapable/basic/5.AsyncSeriesHook.js
 * @description: AsyncSeriesHook
 */
// AsyncSeriesHook 表示异步串联执行
const { AsyncSeriesHook } = require("tapable");

const hook = new AsyncSeriesHook(["a"]);

console.time("timer");
hook.tapAsync("tapAsync", (a, callback) => {
  setTimeout(() => {
    console.log("tapAsync", a);
    callback();
  }, 1000);
});

hook.tapPromise("tapPromise", (a) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("tapPromise", a);
      resolve();
    }, 2000);
  });
});

hook.callAsync("arg1", () => {
  console.timeEnd("timer"); // 3
  console.log("Ending~");
});
