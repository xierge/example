/*
 * @Date: 2023-05-24 15:12:59
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-25 17:51:31
 * @FilePath: /example/webpack/origin-code/tapable/basic/1.SyncHook.js
 * @description: tapable
 */

const { SyncHook } = require("tapable");

// 初始化同步钩子，数组里面值不重要，重要的是字符串的个数
const hook = new SyncHook(["a", "b", "c", "d"]);

// 通过tap注册
hook.tap("test1", (a) => {
  console.log(a); // arg1
});

hook.tap("test2", (a, b, c) => {
  console.log(a, b, c); // arg1 arg2 undefined
});

// call 触发
hook.call("arg1", "arg2");
