/*
 * @Date: 2023-07-17 14:34:27
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-07-20 01:40:11
 * @FilePath: /example/vue/VirtualDom/snabbdom-origin-code/src/modules/class.ts
 * @description: 
 */
import { VNode, VNodeData } from "../vnode";
import { Module } from "./module";

export type Classes = Record<string, boolean>;
function updateClass(oldVnode: VNode, vnode: VNode): void {
  let cur: any;
  let name: string;
  const elm: Element = vnode.elm as Element;
  let oldClass = (oldVnode.data as VNodeData).class;
  let klass = (vnode.data as VNodeData).class;

  if (!oldClass && !klass) return;
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