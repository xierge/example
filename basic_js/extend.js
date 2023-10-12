/*
 * @Date: 2023-10-12 14:51:06
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-10-12 17:27:45
 * @FilePath: /example/basic_js/extend.js
 * @description: 继承的六种方式
 */

// 1. 原型链继承
// 2. 构造函数继承(配合call)
// 3. 组合式继承
// 4. 原型式继承

/**
 * @description: 1. 原型链继承
 * 缺点：hobby数据被多个实例共享
 */
// function prototypeExtend() {
//   function Parent() {
//     this.name = "parent";
//     this.hobby = ["play"];
//   }
//   function Child() {
//     this.name = "child";
//   }
//   Child.prototype = new Parent();
//   const child = new Child();
//   console.log(child);
// }
// prototypeExtend();

/**
 * @description: 2. 构造函数继承(配合call)
 * 缺点：无法继承原型上的方法
 */
// function callExtend() {
//   function Parent() {
//     this.name = "parent";
//     this.hobby = ["play"];
//   }
//   Parent.prototype.getHobby = function () {
//     return this.hobby;
//   };

//   function Child() {
//     this.name = "child";
//     Parent.call(this);
//   }
//   const child = new Child();
//   console.log(child);
//   console.log(child.getHobby());
// }
// callExtend();

/**
 * @description: 3.组合式继承
 */
// function prototypeAndCallExtend() {
//   function Parent() {
//     this.name = "parent";
//     this.hobby = ["play"];
//   }
//   Parent.prototype.getHobby = function () {
//     return this.hobby;
//   };

//   Child.prototype = new Parent();

//   function Child() {
//     this.name = "child";
//     Parent.call(this);
//   }
//   const child1 = new Child();
//   const child2 = new Child();
//   child1.hobby = [];
//   console.log(child2.hobby);
// }
// prototypeAndCallExtend();
