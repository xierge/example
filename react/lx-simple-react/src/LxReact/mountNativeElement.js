/*
 * @Date: 2024-02-20 14:51:23
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 01:37:14
 * @FilePath: /lx-simple-react/src/LxReact/mountNativeElement.js
 * @description:
 */

import mountElement from "./mountElement";
import createDOMElement from "./createDOMElement";
import unmountNode from "./unmountNode";
export default function mountNativeElement(virtualDOM, container, oldDom) {
  oldDom && unmountNode(oldDom);
  let newElement = createDOMElement(virtualDOM);
  container.appendChild(newElement);

  let component = virtualDOM.component;
  if (component) {
    component.setDom(newElement);
  }
}
