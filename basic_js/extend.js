/*
 * @Date: 2023-10-12 14:51:06
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-10-13 15:51:18
 * @FilePath: /example/basic_js/extend.js
 * @description: 继承的七种实现方式
 */

// 1. 原型链继承
// 2. 构造函数继承(配合call)
// 3. 组合式继承
// 4. 原型式继承
// 5.寄生式继承
// 6.寄生组合式继承
/**
 * @description: 1.原型链继承
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
 * @description: 2.构造函数继承(配合call)
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
 * 缺点：调用两次父类构造函数
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

/**
 * @description: 4.原型式继承
 * 缺点：如1原型链继承
 */
// function objectCreateExtend() {
//   let obj = {
//     a: 1,
//     hobby: [],
//   };

//   const child1 = Object.create(obj);
//   child1.hobby.push("play");
//   const child2 = Object.create(obj);
//   child2.hobby.push("sleep");
//   console.log(child2.hobby);
// }
// objectCreateExtend();

/**
 * @description:5.寄生式继承(和原型式继承没什么区别，只是在实例本身加自定义方法)
 */
// function parasiticExtend() {
//   let obj = {
//     a: 1,
//     hobby: [],
//   };
//   function clone(original) {
//     const temp = Object.create(original);
//     temp.play = () => console.log("play");
//     return temp;
//   }

//   let child = clone(obj);
//   console.log(child);
// }
// parasiticExtend();

/**
 * @description:6.寄生组合式继承
 */
// function parasiticMergeExtend() {
//   function Parent() {
//     this.name = "parent";
//     this.hobby = ["play", "sleep"];
//   }
//   Parent.prototype.play = () => console.log("play");
//   function Child() {
//     // 继承constructor的属性
//     Parent.call(this);
//     this.name = "child";
//   }
//   Child.prototype.eat = () => console.log("eat");
//   // 继承原型上的属性
//   function clone(parent, child) {
//     child.prototype = Object.create(parent.prototype);
//     child.prototype.constructor = child;
//   }
//   clone(Parent, Child);
//   const child = new Child();
//   const parent = new Parent();
//   console.log(child.play);
//   console.log(parent);
// }
// parasiticMergeExtend();

/**
 * @description: 7.extends关键字
 */
function classExtend() {
  class Parent {
    constructor(name, age) {
      this.name = name;
      this.age = age;
      this.play = () => console.log("play");
    }
  }

  class Child extends Parent {
    constructor(name, age) {
      super(name, age);
    }
  }

  const parent = new Parent("parent", 40);
  const child = new Parent("child", 20);
  console.log(parent);
  console.log(child);
}
classExtend();
