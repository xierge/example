/*
 * @Date: 2023-05-24 15:12:59
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-25 17:51:48
 * @FilePath: /example/webpack/origin-code/tapable/basic/7.AsyncSeriesWaterfallHook.js
 * @description: AsyncSeriesWaterfallHook
 */
// AsyncSeriesHook 表示异步串行保险钩子
const { AsyncSeriesWaterfallHook } = require("tapable");

const hook = new AsyncSeriesWaterfallHook(["a"]);

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
  console.timeEnd("timer"); // 3
  console.log("Ending~");
});
