import { VNode, VNodeData } from "../vnode";
import { Module } from "./module";

type Listener<T> = (this: VNode, ev: T, vnode: VNode) => void;

export type On = {
  [N in keyof HTMLElementEventMap]?:
  | Listener<HTMLElementEventMap[N]>
  | Array<Listener<HTMLElementEventMap[N]>>;
} & {
  [event: string]: Listener<any> | Array<Listener<any>>;
};

type SomeListener<N extends keyof HTMLElementEventMap> =
  | Listener<HTMLElementEventMap[N]>
  | Listener<any>;

function invokeHandler<N extends keyof HTMLElementEventMap>(
  handler: SomeListener<N> | Array<SomeListener<N>>,
  vnode: VNode,
  event?: Event
): void {
  if (typeof handler === "function") {
    // call function handler
    handler.call(vnode, event, vnode);
  } else if (typeof handler === "object") {
    // call multiple handlers
    for (let i = 0; i < handler.length; i++) {
      invokeHandler(handler[i], vnode, event);
    }
  }
}

function handleEvent(event: Event, vnode: VNode) {
  const name = event.type;
  const on = (vnode.data as VNodeData).on;

  // call event handler(s) if exists
  if (on && on[name]) {
    invokeHandler(on[name], vnode, event);
  }
}

function createListener() {
  return function handler(event: Event) {
    handleEvent(event, (handler as any).vnode);
  };
}

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

export const eventListenersModule: Module = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners,
};
