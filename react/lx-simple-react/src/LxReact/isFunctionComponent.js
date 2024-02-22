/*
 * @Date: 2024-02-21 15:49:30
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-21 15:54:55
 * @FilePath: /lx-simple-react/src/LxReact/isFunctionComponent.js
 * @description:
 */
import isFunction from "./isFunction";
// 判断是否是函数组件
export default function isFunctionComponent(virtualDOM) {
  const type = virtualDOM.type;

  return type && isFunction(virtualDOM) && !type.prototype?.render;
}
