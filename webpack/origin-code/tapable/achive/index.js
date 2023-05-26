/*
 * @Date: 2023-05-25 17:52:25
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-26 11:58:52
 * @FilePath: /example/webpack/origin-code/tapable/achive/index.js
 * @description:
 */
// 基础类 Hook
// SyncHook继承自Hook
// tap注册时会在实例对象的taps数组push
// call时会触发HooCodekFactory类的方法生成函数
// 执行此函数
exports.SyncHook = require("./SyncHook");
