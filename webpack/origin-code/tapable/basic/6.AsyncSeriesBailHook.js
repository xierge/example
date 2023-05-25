/*
 * @Date: 2023-05-24 15:12:59
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-25 17:51:45
 * @FilePath: /example/webpack/origin-code/tapable/basic/6.AsyncSeriesBailHook.js
 * @description: AsyncSeriesBailHook
 */
// AsyncSeriesHook 表示异步串行保险钩子
const { AsyncSeriesBailHook } = require("tapable");

const hook = new AsyncSeriesBailHook(["a"]);

console.time("timer");
hook.tapAsync("tapAsync", (a, callback) => {
  setTimeout(() => {
    console.log("tapAsync", a);
    callback(true);
    // 阻断 Ending~
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
