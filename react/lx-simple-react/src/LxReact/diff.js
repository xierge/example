/*
 * @Date: 2024-02-20 14:46:20
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 01:28:32
 * @FilePath: /lx-simple-react/src/LxReact/diff.js
 * @description:
 */

import mountElement from "./mountElement";
import updateTextNode from "./updateTextNode";
import updateNodeElement from "./updateNodeElement";
import createDOMElement from "./createDOMElement";
import unmountNode from "./unmountNode";
import diffComponent from "./diffComponent";
export default function diff(virtualDOM, container, oldDom) {
  const oldVirtualDOM = oldDom && oldDom._virtualDOM;
  // 判断是否是第一次渲染
  if (!oldDom) {
    mountElement(virtualDOM, container, oldDom);
  } else if (
    oldVirtualDOM &&
    virtualDOM.type !== oldVirtualDOM.type &&
    typeof virtualDOM.type !== "function"
  ) {
    // 节点类型不同
    const newElement = createDOMElement(virtualDOM);
    newElement._virtualDOM = virtualDOM;
    oldDom.parentNode.replaceChild(newElement, oldDom);
  } else if (typeof virtualDOM.type === "function") {
    const oldComponent = oldVirtualDOM && oldVirtualDOM.component;
    diffComponent(virtualDOM, oldComponent, oldDom, container);
  } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {
    // 节点类型相同
    if (virtualDOM.type === "text") {
      // 更新内容
      updateTextNode(virtualDOM, oldVirtualDOM, oldDom);
    } else {
      // 更新元素节点属性
      updateNodeElement(oldDom, virtualDOM, oldVirtualDOM);
    }

    // 递归diff对比子节点
    virtualDOM.children?.forEach((child, i) => {
      diff(child, oldDom, oldDom.childNodes[i]);
    });

    // 删除节点
    let oldChildNodes = oldDom.childNodes;
    if (oldChildNodes.length > virtualDOM.children.length) {
      for (
        let i = oldChildNodes.length - 1;
        i > virtualDOM.children.length - 1;
        i--
      ) {
        unmountNode(oldChildNodes[i]);
      }
    }
  }
}
