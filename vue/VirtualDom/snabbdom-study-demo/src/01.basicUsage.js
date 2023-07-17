/*
 * @Date: 2023-07-17 15:00:04
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-07-17 18:28:55
 * @FilePath: /example/vue/VirtualDom/snabbdom-study-demo/src/01.basicUsage.js
 * @description: snabbdom 的基本使用
 */

// 1. init() 设置模块，创建 patch 函数
// 2. h() 创建对象描述真实 dom
// 3. patch() 比较新旧 vnode
// 4. 将变化的内容渲染到真实 dom 树中

import {
  init,
  //   h,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
} from "snabbdom";
import { h } from "./h";

console.log(classModule);
// 初始化 patch 函数，主要是对h的第二个参数 class，style，on，props 权限控制
const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);

// 通过 h 函数生成 vnode
const vnode = h(
  "h1#id.class",
  {
    style: {
      color: "red",
    },
    on: {
      click: () => console.log("click"),
    },
    props: {
      lover: "lsq",
    },
    class: { lx: true },
  },
  [
    h(
      "h1#id.class",
      {
        style: {
          color: "red",
        },
        on: {
          click: () => console.log("click"),
        },
        props: {
          lover: "lsq",
        },
        class: { lx: true },
      },
      "hello lx"
    ),
  ]
);

const container = document.getElementById("container");

// 将 vnode 渲染到页面上
patch(container, vnode);
