/*
 * @Date: 2023-10-11 16:20:32
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-10-12 14:48:53
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

// 乞丐版本
{
  // 1. 函数/undefined/Symbol导致键丢失
  // 2. NaN/infinity变为null
  // 3. 正则变成空对象
  // 4. Date类型变成字符串
  // 5. 无法拷贝原型链
  // 6. 无法拷贝不可枚举的值
  // 7. 无法拷贝对象成环
  function json_fun(params) {
    return JSON.parse(JSON.stringify(params));
  }
  //   console.log(json_fun(demoObj));
  //   {
  //     obj: { a: 1 },
  //     arr: [ 1, 2, 3 ],
  //     reg: {},
  //     date: '1970-01-01T00:00:00.000Z',
  //     NaN: null,
  //     infinity: null
  //   }
}

// 递归基础版本
{
  let obj = {
    a: {
      b: 1,
    },
  };

  function deepClone(params) {
    let tempObj = {};
    for (const key in params) {
      if (typeof params[key] !== "object") {
        tempObj[key] = params[key];
      } else {
        tempObj[key] = deepClone(params[key]);
      }
    }
    return tempObj;
  }
  //   const resObj = deepClone(obj);
  //   obj.a.b = 2;
  //   console.log(resObj);
}

// 完整版本
{
  const isComplexDataType = (params) =>
    (typeof params === "object" || typeof params === "function") &&
    params !== null;
  function deepClone(params, hash = new WeakMap()) {
    // 日期类型
    if (params.constructor === Date) return new Date(params);

    // 正则
    if (params.constructor === RegExp) return new RegExp(params);

    // 解决循环引用问题
    if (hash.has(params)) return hash.get(params);

    // 获取对象的其他属性 writable enumerable value 等
    const allDescs = Object.getOwnPropertyDescriptors(params);

    let cloneObj = Object.create(Object.getPrototypeOf(params), allDescs);
    hash.set(params, cloneObj);

    // Reflect.ownKeys 可以获取对象的所有key 包括不可枚举 sysbol 等
    for (const key of Reflect.ownKeys(params)) {
      // 对象类型需要递归处理
      cloneObj[key] =
        isComplexDataType(params[key]) && typeof params[key] !== "function"
          ? deepClone(params[key], hash)
          : params[key];
    }

    return cloneObj;
  }
  console.log(deepClone(demoObj));
}
