/*
 * @Date: 2024-02-21 15:23:26
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 02:00:53
 * @FilePath: /lx-simple-react/src/LxReact/createDOMElement.js
 * @description:
 */
import mountElement from "./mountElement";
import updateNodeElement from "./updateNodeElement";
export default function createDOMElement(virtualDOM) {
  let newElement = null;
  // 文本节点
  if (virtualDOM.type === "text") {
    newElement = document.createTextNode(virtualDOM.props.textContent);
  } else {
    // 元素节点
    newElement = document.createElement(virtualDOM.type);
    updateNodeElement(newElement, virtualDOM);
  }
  newElement._virtualDOM = virtualDOM;

  virtualDOM.children?.forEach((child) => mountElement(child, newElement));

  if (virtualDOM?.props?.ref) {
    virtualDOM?.props?.ref(newElement);
  }
  return newElement;
}
