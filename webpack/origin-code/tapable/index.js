/*
 * @Date: 2023-05-24 15:12:59
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-24 15:21:24
 * @FilePath: /example/webpack/origin-code/tapable/index.js
 * @description: tapable
 */

const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require("tapable");

// 初始化同步钩子，数组里面值不重要，重要的是字符串的个数
const sync = new SyncHook(["a", "b", "c", "d"]);

// 通过tap注册
sync.tap("test1", (a) => {
  console.log(a);
});

sync.tap("test2", (a, b, c) => {
  console.log(a, b, c);
});

// call 触发
sync.call("arg1", "arg2");
