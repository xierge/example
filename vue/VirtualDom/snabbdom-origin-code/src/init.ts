import { Module } from "./modules/module";
import { vnode, VNode } from "./vnode";
import * as is from "./is";
import { htmlDomApi, DOMAPI } from "./htmldomapi";

type NonUndefined<T> = T extends undefined ? never : T;

function isUndef(s: any): boolean {
  return s === undefined;
}
function isDef<A>(s: A): s is NonUndefined<A> {
  return s !== undefined;
}

type VNodeQueue = VNode[];

const emptyNode = vnode("", {}, [], undefined, undefined);

function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
  const isSameKey = vnode1.key === vnode2.key;
  const isSameIs = vnode1.data?.is === vnode2.data?.is;
  const isSameSel = vnode1.sel === vnode2.sel;
  const isSameTextOrFragment =
    !vnode1.sel && vnode1.sel === vnode2.sel
      ? typeof vnode1.text === typeof vnode2.text
      : true;

  return isSameSel && isSameKey && isSameIs && isSameTextOrFragment;
}

/**
 * @todo Remove this function when the document fragment is considered stable.
 */
function documentFragmentIsNotSupported(): never {
  throw new Error("The document fragment is not supported on this platform.");
}

function isElement(
  api: DOMAPI,
  vnode: Element | DocumentFragment | VNode
): vnode is Element {
  return api.isElement(vnode as any);
}

function isDocumentFragment(
  api: DOMAPI,
  vnode: DocumentFragment | VNode
): vnode is DocumentFragment {
  return api.isDocumentFragment!(vnode as any);
}

type KeyToIndexMap = { [key: string]: number };

type ArraysOf<T> = {
  [K in keyof T]: Array<T[K]>;
};

type ModuleHooks = ArraysOf<Required<Module>>;

function createKeyToOldIdx(
  children: VNode[],
  beginIdx: number,
  endIdx: number
): KeyToIndexMap {
  const map: KeyToIndexMap = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key;
    if (key !== undefined) {
      map[key as string] = i;
    }
  }
  return map;
}

const hooks: Array<keyof Module> = [
  "create",
  "update",
  "remove",
  "destroy",
  "pre",
  "post",
];

// TODO Should `domApi` be put into this in the next major version bump?
export type Options = {
  experimental?: {
    fragments?: boolean;
  };
};

export function init(
  modules: Array<Partial<Module>>,
  domApi?: DOMAPI,
  options?: Options
) {
  const cbs: ModuleHooks = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [],
  };

  const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi;

  for (const hook of hooks) {
    for (const module of modules) {
      const currentHook = module[hook];
      if (currentHook !== undefined) {
        (cbs[hook] as any[]).push(currentHook);
      }
    }
  }

  function emptyNodeAt(elm: Element) {
    const id = elm.id ? "#" + elm.id : "";

    // elm.className doesn't return a string when elm is an SVG element inside a shadowRoot.
    // https://stackoverflow.com/questions/29454340/detecting-classname-of-svganimatedstring
    const classes = elm.getAttribute("class");

    const c = classes ? "." + classes.split(" ").join(".") : "";
    return vnode(
      api.tagName(elm).toLowerCase() + id + c,
      {},
      [],
      undefined,
      elm
    );
  }

  function emptyDocumentFragmentAt(frag: DocumentFragment) {
    return vnode(undefined, {}, [], undefined, frag);
  }

  function createRmCb(childElm: Node, listeners: number) {
    return function rmCb() {
      if (--listeners === 0) {
        const parent = api.parentNode(childElm) as Node;
        api.removeChild(parent, childElm);
      }
    };
  }

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

  function addVnodes(
    parentElm: Node,
    before: Node | null,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number,
    insertedVnodeQueue: VNodeQueue
  ) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch != null) {
        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
      }
    }
  }

  function invokeDestroyHook(vnode: VNode) {
    const data = vnode.data;
    if (data !== undefined) {
      data?.hook?.destroy?.(vnode);
      for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
      if (vnode.children !== undefined) {
        for (let j = 0; j < vnode.children.length; ++j) {
          const child = vnode.children[j];
          if (child != null && typeof child !== "string") {
            invokeDestroyHook(child);
          }
        }
      }
    }
  }

  function removeVnodes(
    parentElm: Node,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number
  ): void {
    for (; startIdx <= endIdx; ++startIdx) {
      let listeners: number;
      let rm: () => void;
      const ch = vnodes[startIdx];
      if (ch != null) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm!, listeners);
          for (let i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
          const removeHook = ch?.data?.hook?.remove;
          if (isDef(removeHook)) {
            removeHook(ch, rm);
          } else {
            rm();
          }
        } else if (ch.children) {
          // Fragment node
          invokeDestroyHook(ch);
          removeVnodes(
            parentElm,
            ch.children as VNode[],
            0,
            ch.children.length - 1
          );
        } else {
          // Text node
          api.removeChild(parentElm, ch.elm!);
        }
      }
    }
  }

// 根据新旧节点 children 对比更新
function updateChildren(
  parentElm: Node,
  oldCh: VNode[],
  newCh: VNode[],
  insertedVnodeQueue: VNodeQueue
) {

  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx: KeyToIndexMap | undefined;
  let idxInOld: number;
  let elmToMove: VNode;
  let before: any;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 过滤 children 为空的情况
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
    // 比较新旧节点的头是否为同一个节点
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    // 比较新旧节点的尾是否为同一个节点
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    // 比较新节点的尾和旧节点的头是否为同一个节点
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
      api.insertBefore(
        parentElm,
        oldStartVnode.elm!,
        api.nextSibling(oldEndVnode.elm!)
      );
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    // 比较新节点的头和旧节点的尾是否为同一个节点
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
      api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 以上多种条件都不成立
      if (oldKeyToIdx === undefined) {
        // 生成 key 与 index 的映射
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = oldKeyToIdx[newStartVnode.key as string];
      // 新 children 的 key 在老节点中没有
      if (isUndef(idxInOld)) {
        // 插入元素
        api.insertBefore(
          parentElm,
          createElm(newStartVnode, insertedVnodeQueue),
          oldStartVnode.elm!
        );
      } else {
        // 获取旧 children 与此 key 相同的节点
        elmToMove = oldCh[idxInOld];
        
        // 两者 sel(tag||id||class) 不同
        if (elmToMove.sel !== newStartVnode.sel) {
          api.insertBefore(
            parentElm,
            createElm(newStartVnode, insertedVnodeQueue),
            oldStartVnode.elm!
          );
        } else {
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined as any;
          api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!);
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }

  // 新 children 数量大于旧 children
  if (newStartIdx <= newEndIdx) {
    before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
    addVnodes(
      parentElm,
      before,
      newCh,
      newStartIdx,
      newEndIdx,
      insertedVnodeQueue
    );
  }

  // 新 children 数量小于旧 children
  if (oldStartIdx <= oldEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }
}

  // 对比新旧节点 
  function patchVnode(
    oldVnode: VNode,
    vnode: VNode,
    insertedVnodeQueue: VNodeQueue
  ) {
    // 新节点 elm 赋值
    const elm = (vnode.elm = oldVnode.elm)!;
    // 节点完全相同
    if (oldVnode === vnode) return;
    // 新旧节点的 data 或者文本不同
    if (
      vnode.data !== undefined ||
      (isDef(vnode.text) && vnode.text !== oldVnode.text)
    ) {
      vnode.data ??= {};  
      oldVnode.data ??= {};
      // updateHook 调用
      for (let i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode);
      }
    }
    const oldCh = oldVnode.children as VNode[];
    const ch = vnode.children as VNode[];
    // 对比children
    if (isUndef(vnode.text)) {
      // 新旧节点都有children
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      // 新节点有children 旧节点没有children
      } else if (isDef(ch)) {
        // 旧节点有文本就设置为空
        if (isDef(oldVnode.text)) api.setTextContent(elm, "");
        // 在 elm dom 中增加 children 的子节点
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      // 新节点没有children 旧节点有children
      } else if (isDef(oldCh)) {
        // 删除节点点的 children
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        // 新旧节点都没有 children 且 新节点没有文本， 将文本节点内容设置为空
        api.setTextContent(elm, "");
      }
    // 对比文本内容
    } else if (oldVnode.text !== vnode.text) {
      // 移除旧的文本节点
      if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      }
      // 设置文本节点内容
      api.setTextContent(elm, vnode.text!);
    }
  }

  return function patch(
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
      // 获取父节点
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
    return vnode;
  };
}
