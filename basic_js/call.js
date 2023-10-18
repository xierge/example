/*
 * @Date: 2023-10-18 14:59:31
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-10-18 15:05:15
 * @FilePath: /example/basic_js/call.js
 * @description:实现call方法
 */
Function.prototype.myCall = function (context, ...args) {
  context = context || window;
  context.fn = this;
  const res = context.fn(...args);
  delete context.fn;
  return res;
};

let obj = {
  name: "basic",
};
function getName() {
  console.log(this.name);
}

getName.myCall(obj);
