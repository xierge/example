/*
 * @Date: 2023-10-11 16:20:32
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-10-11 16:45:29
 * @FilePath: /example/basic_js/deepClone.js
 * @description: 深拷贝的实现方式
 */

function Obj() {
  this.func = function () {
    alert(1);
  };
  this.obj = { a: 1 };
  this.arr = [1, 2, 3];
  this.und = undefined;
  this.reg = /123/;
  this.date = new Date(0);
  this.NaN = NaN;
  this.infinity = Infinity;
  this.sym = Symbol(1);
}

let demoObj = new Obj();

{
  // 乞丐版本
  // 1. 函数/undefined/Symbol丢失
  function json_fun(params) {
    return JSON.parse(JSON.stringify(params));
  }
  console.log(json_fun(demoObj));
  //   {
  //     obj: { a: 1 },
  //     arr: [ 1, 2, 3 ],
  //     reg: {},
  //     date: '1970-01-01T00:00:00.000Z',
  //     NaN: null,
  //     infinity: null
  //   }
}
