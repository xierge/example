# Virtual Dom

## 什么是 Virtual Dom？

简单的说，Virtual Dom 只是一个普通的对象。

```js
const virtualDom = {
  sel: "div",
  data: {},
  children: undefined,
  text: "hello lx",
  elm: undefined,
  key: undefined,
};
```

### Virtual Dom 的优点

1. 复杂情况提升渲染性能
2. 维护视图和状态的关系
3. 跨平台 ssr 小程序

## 虚拟 dom 库（snabbdom）

### 搭建项目基础结构

parcel 官网 : https://www.parceljs.cn/

**初始化项目并安装依赖**

```bash
npm init -y

yarn add parcel-bundler -D

yarn add snabbdom
```

**配置 scripts**

```json
 "scripts": {
    "dev":"parcel index.html --open",
    "build":"parcel build index.html"
  }
```

**目录结构**

```
snabbdom-study-demo
├── index.html
├── node_modules
├── package.json
├── src
│   ├── 01.basicUsage
└── yarn.lock
```

### snabdom 基本使用

1. init() 设置模块，创建 patch 函数
2. h() 创建对象描述真实 dom
3. patch() 比较新旧 vnode
4. 将变化的内容渲染到真实 dom 树中

```js
import {
  init,
  h,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
} from "snabbdom";

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
  "hello,lx"
);

const container = document.getElementById("container");

// 将 vnode 渲染到页面上
patch(container, vnode);
```

### 源码分析

#### h 函数

```ts
export interface VNode {
  sel: string | undefined; // tag 标签
  data: VNodeData | undefined; // class | style | on | props | key
  children: Array<VNode | string> | undefined; // children
  elm: Node | undefined; // Element | DocumentFragment | Text | undefined
  text: string | undefined; // Text
  key: Key | undefined; // string | number | symbol
}

//
export interface VNodeData {
  props?: Props;
  attrs?: Attrs;
  class?: Classes;
  style?: VNodeStyle;
  dataset?: Dataset;
  on?: On;
  attachData?: AttachData;
  hook?: Hooks;
  key?: Key;
  ns?: string;
  fn?: () => VNode;
  args?: any[];
  is?: string;
  [key: string]: any;
}

export declare function h(sel: string): VNode;
export declare function h(sel: string, data: VNodeData | null): VNode;
export declare function h(sel: string, children: VNodeChildren): VNode;
export declare function h(
  sel: string,
  data: VNodeData | null,
  children: VNodeChildren
): VNode;

export function h(sel: any, b?: any, c?: any): VNode {
  let data: VNodeData = {};
  let children: any;
  let text: any;
  let i: number;
  // 传值为三个参数的处理
  if (c !== undefined) {
    if (b !== null) {
      data = b;
    }
    if (is.array(c)) {
      children = c;
    } else if (is.primitive(c)) {
      text = c.toString();
    } else if (c && c.sel) {
      children = [c];
    }
    // 传值为两个参数的处理
  } else if (b !== undefined && b !== null) {
    if (is.array(b)) {
      children = b;
    } else if (is.primitive(b)) {
      text = b.toString();
    } else if (b && b.sel) {
      children = [b];
    } else {
      data = b;
    }
  }

  // 如果 children[i] 为 string｜number，转化成 vnode 对象
  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      if (is.primitive(children[i]))
        children[i] = vnode(
          undefined,
          undefined,
          undefined,
          children[i],
          undefined
        );
    }
  }

  // 生成 vnode 对象
  return vnode(sel, data, children, text, undefined);
}
```

#### patch
