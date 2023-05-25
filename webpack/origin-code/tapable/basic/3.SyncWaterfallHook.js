/*
 * @Date: 2023-05-24 15:12:59
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-25 17:51:34
 * @FilePath: /example/webpack/origin-code/tapable/basic/3.SyncWaterfallHook.js
 * @description: SyncWaterfallHook
 */
// 瀑布钩子会将上一个函数的返回值传递给下一个函数作为参数
const { SyncWaterfallHook } = require("tapable");

const hook = new SyncWaterfallHook(["a", "b", "c", "d"]);

hook.tap("test1", (a, b) => {
  console.log(a, b); // arg1  arg2
  return 1;
});

hook.tap("test2", (a, b) => {
  console.log(a, b); // 1  arg2
});

hook.tap("test3", (a, b) => {
  console.log(a, b); // 1  arg2
});

hook.call("arg1", "arg2");

// > 通过 SyncWaterfallHook 仅能修改第一个参数的返回值
