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

### 源码分析（核心代码）

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

#### classModule

```
// class 结构
//	{
//		active: true,
//		focus: false,
//	}

function updateClass(oldVnode: VNode, vnode: VNode): void {
  let cur: any;
  let name: string;
  const elm: Element = vnode.elm as Element;
  // 获取新旧节点 data 中的 class
  let oldClass = (oldVnode.data as VNodeData).class;
  let klass = (vnode.data as VNodeData).class;

	// 两者都不存在 class  结束函数
  if (!oldClass && !klass) return;
  // 两者 class 相同  结束函数
  if (oldClass === klass) return;
  oldClass ??= {};
  klass ??= {};

    // 旧节点 class = true 而 新节点不存在的class， dom 上 该 class 移除 
  for (name in oldClass) {
    if (oldClass[name] && !Object.prototype.hasOwnProperty.call(klass, name)) {
      // was `true` and now not provided
      elm.classList.remove(name);
    }
  }
  // 新节点有的 class 旧节点没有就在 dom 上添加
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      (elm.classList as any)[cur ? "add" : "remove"](name);
    }
  }
}

export const classModule: Module = { create: updateClass, update: updateClass };
```



#### propsModule

```
// props 属性只会增加
function updateProps(oldVnode: VNode, vnode: VNode): void {
  let key: string;
  let cur: any;
  let old: any;
  const elm = vnode.elm;
  let oldProps = (oldVnode.data as VNodeData).props;
  let props = (vnode.data as VNodeData).props;

  if (!oldProps && !props) return;
  if (oldProps === props) return;
  oldProps = oldProps || {};
  props = props || {};

  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== "value" || (elm as any)[key] !== cur)) {
      (elm as any)[key] = cur;
    }
  }
}

export const propsModule: Module = { create: updateProps, update: updateProps };
```



#### eventListenersModule

```
function updateEventListeners(oldVnode: VNode, vnode?: VNode): void {
  // 获取旧节点的 data.on  listener  真实DOM
  const oldOn = (oldVnode.data as VNodeData).on;
  const oldListener = (oldVnode as any).listener;
  const oldElm: Element = oldVnode.elm as Element;
  // 获取新节点的 data.on  真实DOM
  const on = vnode && (vnode.data as VNodeData).on;
  const elm: Element = (vnode && vnode.elm) as Element;
  let name: string;

  // 如果新旧节点的 on 相同 直接结束函数
  if (oldOn === on) {
    return;
  }

  // 如果旧节点的事件存在，与新节点对比 remove 一些不存在的事件监听
  if (oldOn && oldListener) {
    // 如果新节点不存在事件的监听，remove 旧节点的所有事件监听
    if (!on) {
      for (name in oldOn) {
        // remove 所有的事件监听
        oldElm.removeEventListener(name, oldListener, false);
      }
    } else {
      for (name in oldOn) {
        // 如果新节点不存在此事件监听 remove
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      }
    }
  }

  // 新节点的存在事件监听
  if (on) {
    // reuse existing listener or create new
    const listener = ((vnode as any).listener =
      (oldVnode as any).listener || createListener());
    // update vnode for listener
    listener.vnode = vnode;

    // 如果旧节点不存在事件监听  add data.on 的所有事件 
    if (!oldOn) {
      for (name in on) {
        elm.addEventListener(name, listener, false);
      }
    } else {
      for (name in on) {
        // 旧节点没有的事件监听，add 事件监听
        if (!oldOn[name]) {
          elm.addEventListener(name, listener, false);
        }
      }
    }
  }
}
```



#### init



#### patch

```
function patch(
    oldVnode: VNode | Element | DocumentFragment,
    vnode: VNode
  ): VNode {
    let i: number, elm: Node, parent: Node;
    const insertedVnodeQueue: VNodeQueue = [];

    // 执行 pre 钩子函数
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    // 判断 oldVnode 是否是真实 DOM
    if (isElement(api, oldVnode)) {
      // 将真实 DOM 转换成 vnode 对象
      oldVnode = emptyNodeAt(oldVnode);
    } else if (isDocumentFragment(api, oldVnode)) {
      oldVnode = emptyDocumentFragmentAt(oldVnode);
    }

    // 通过 key sel 等判断是否是同一个节点 
    if (sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
      //不同节点的处理
      elm = oldVnode.elm!;
      parent = api.parentNode(elm) as Node;

			// 创建新的元素 vnode.elm
      createElm(vnode, insertedVnodeQueue);

      if (parent !== null) {
        // 插入新的 dom 到指定位置
        api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
        // 移除旧的节点
        removeVnodes(parent, [oldVnode], 0, 0);
      }
      }
    }
    return vnode;
  };
```



#### createElm

1. 根据sel解析出元素的 tag id class 信息
2. 根据tag创建元素，设置id，class属性
3. 加载createHook
4. 判断children是否为数组，如果是数组，循环递归调用 createElm 生成 dom 节点并且添加至自身元素

```
function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
  let i: any;
  let data = vnode.data;
  const children = vnode.children;
  const sel = vnode.sel;
  // 如果sel==="!" 表示创建注释节点
  if (sel === "!") {
    if (isUndef(vnode.text)) {
      vnode.text = "";
    }
    vnode.elm = api.createComment(vnode.text!);
  } else if (sel !== undefined) {
    // 取id，class索引 
    const hashIdx = sel.indexOf("#");
    const dotIdx = sel.indexOf(".", hashIdx);
    const hash = hashIdx > 0 ? hashIdx : sel.length;
    const dot = dotIdx > 0 ? dotIdx : sel.length;
    // 获取元素的Tag
    const tag =
      hashIdx !== -1 || dotIdx !== -1
        ? sel.slice(0, Math.min(hash, dot))
        : sel;
    // 创建元素
    const elm = (vnode.elm =
      isDef(data) && isDef((i = data.ns))
        ? api.createElementNS(i, tag, data)
        : api.createElement(tag, data));
    // 元素设置 id class
    if (hash < dot) elm.setAttribute("id", sel.slice(hash + 1, dot));
    if (dotIdx > 0)
      elm.setAttribute("class", sel.slice(dot + 1).replace(/\./g, " "));
    // 调用 createHooks 
    for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
    // 判断 children 是否是数组，循环递归调用 createElm
    if (is.array(children)) {
      for (i = 0; i < children.length; ++i) {
        const ch = children[i];
        if (ch != null) {
          api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue));
        }
      }
    // 判断 text 是否是数字和字符串
    } else if (is.primitive(vnode.text)) {
      api.appendChild(elm, api.createTextNode(vnode.text));
    }
    // data 中定义的 hook
    const hook = vnode.data!.hook;
    if (isDef(hook)) {
      hook.create?.(emptyNode, vnode);
      if (hook.insert) {
        insertedVnodeQueue.push(vnode);
      }
    }
  } else {
    vnode.elm = api.createTextNode(vnode.text!);
  }
  return vnode.elm;
}
```

