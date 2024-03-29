/*
 * @Date: 2023-07-17 14:34:27
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-07-17 18:27:20
 * @FilePath: /example/vue/VirtualDom/snabbdom-origin-code/src/index.ts
 * @description: 
 */
// core
export { DOMAPI, htmlDomApi } from "./htmldomapi";
export { init, Options } from "./init";
export { ThunkData, Thunk, ThunkFn, thunk } from "./thunk";
export { Key, VNode, VNodeData, vnode } from "./vnode";

// helpers
export { AttachData, attachTo } from "./helpers/attachto";
export { array, primitive } from "./is";
export { toVNode } from "./tovnode";
export {
  VNodes,
  VNodeChildElement,
  ArrayOrElement,
  VNodeChildren,
  h,
  fragment,
} from "./h";

// types
export * from "./hooks";
export { Module } from "./modules/module";

// modules
export { Attrs, attributesModule } from "./modules/attributes";
export { Classes, classModule } from "./modules/class";
export { Dataset, datasetModule } from "./modules/dataset";
export { On, eventListenersModule } from "./modules/eventlisteners";
export { Props, propsModule } from "./modules/props";
export { VNodeStyle, styleModule } from "./modules/style";

// JSX
export {
  JsxVNodeChild,
  JsxVNodeChildren,
  FunctionComponent,
  jsx,
  Fragment,
} from "./jsx";
