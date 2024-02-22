import mountElement from "./mountElement";

/*
 * @Date: 2024-02-22 01:27:54
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 01:50:00
 * @FilePath: /lx-simple-react/src/LxReact/diffComponent.js
 * @description:
 */
import updateComponent from "./updateComponent";
export default function diffComponent(
  virtualDOM,
  oldComponent,
  oldDom,
  container
) {
  if (isSameComponent(virtualDOM, oldComponent)) {
    updateComponent(virtualDOM, oldComponent, oldDom, container);
  } else {
    mountElement(virtualDOM, container, oldDom);
  }
}

// 判断是否是同一个组件
function isSameComponent(virtualDOM, oldComponent) {
  return oldComponent && virtualDOM.type === oldComponent.constructor;
}
