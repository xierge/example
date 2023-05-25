/*
 * @Date: 2023-05-24 15:12:59
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-25 17:51:38
 * @FilePath: /example/webpack/origin-code/tapable/basic/4.SyncLoopHook.js
 * @description: SyncLoopHook
 */
// 会在任意一个被监听的函数存在非 undefined 返回值时返回重头开始执行
const { SyncLoopHook } = require("tapable");

const hook = new SyncLoopHook(["a", "b", "c", "d"]);

hook.tap("test1", (a) => {
  console.log(a);
});

hook.tap("test2", (a) => {
  console.log(a);
  return Math.random() > 0.5 ? 1 : undefined; // 非 undefined 返回值时返回重头开始执行
});

hook.tap("test3", (a) => {
  console.log(a);
});

hook.call("arg1");
