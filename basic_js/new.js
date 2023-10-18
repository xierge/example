/*
 * @Date: 2023-10-18 14:04:48
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-10-18 14:59:24
 * @FilePath: /example/basic_js/new.js
 * @description: 实现new方法
 */

function basicFn(name, age) {
  this.name = name;
  this.age = age;
  this.sayName = function () {
    console.log(`我是${this.name}`);
  };
}
function newInstance(fn, ...args) {
  if (typeof fn !== "function") {
    throw new Error("fn must be a function");
  }
  let obj = new Object();
  obj.__proto__ = Object.create(fn.prototype);
  let res = fn.call(obj, ...args);
  let isObject = typeof res === "object" && res !== null;
  let isFunction = typeof res === "function";
  return isObject || isFunction ? res : obj;
}

const instance = newInstance(basicFn, "basicFn", 18);
instance.sayName();
console.log(instance);
