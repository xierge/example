/*
 * @Date: 2023-05-25 17:52:19
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-26 11:41:25
 * @FilePath: /example/webpack/origin-code/tapable/achive/Hook.js
 * @description:
 */

const CALL_DELEGATE = function (...args) {
  this.call = this._createCall("sync");
  return this.call(...args);
};

class Hook {
  constructor(args: [], name = undefined) {
    // 保存初始化参数
    this.args = args;
    // name 无实际使用 可忽略
    this.name = name;
    // 注册通过的内容
    this.taps = [];
    // _x存放hook中所有通过tap注册的函数;
    this._x = undefined;

    this._call = CALL_DELEGATE;
    this.call = CALL_DELEGATE;
  }

  tap(options, fn) {
    this._tap("sync", options, fn);
  }

  _tap(type, options, fn) {
    if (typeof options === "string") {
      options = { name: options };
    }
    options = Object.assign({ type, fn }, options);
    this._insert(options);
  }

  _insert(item) {
    this.taps.push(item);
  }

  _createCall(type) {
    return this.compile({ taps: this.taps, args: this.args, type });
  }
}

module.exports = Hook;
