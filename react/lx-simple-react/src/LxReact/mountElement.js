/*
 * @Date: 2024-02-20 14:48:58
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 01:35:47
 * @FilePath: /lx-simple-react/src/LxReact/mountElement.js
 * @description:
 */

import mountNativeElement from "./mountNativeElement";
import mountComponentElement from "./mountComponent";
import isFunction from "./isFunction";
export default function mountElement(virtualDOM, container, oldDom) {
  if (isFunction(virtualDOM)) {
    // Component
    mountComponentElement(virtualDOM, container, oldDom);
  } else {
    // NativeElement
    mountNativeElement(virtualDOM, container, oldDom);
  }
}
