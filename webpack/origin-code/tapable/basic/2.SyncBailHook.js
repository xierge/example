/*
 * @Date: 2023-05-24 15:12:59
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-25 17:51:27
 * @FilePath: /example/webpack/origin-code/tapable/basic/2.SyncBailHook.js
 * @description: SyncBailHook
 */

//如果任何事件函数存在返回值，那么会立即中断后续事件函数的调用
const { SyncBailHook } = require("tapable");

const hook = new SyncBailHook(["a", "b", "c", "d"]);

hook.tap("test1", (a) => {
  console.log(a); // arg1
  return true;
  // 结束
});

hook.tap("test2", (a) => {
  console.log(a);
});

hook.call("arg1");
