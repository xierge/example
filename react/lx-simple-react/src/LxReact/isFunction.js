/*
 * @Date: 2024-02-20 23:37:05
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-21 15:45:30
 * @FilePath: /lx-simple-react/src/LxReact/isFunction.js
 * @description:
 */
export default function isFunction(virtualDOM) {
  return virtualDOM && typeof virtualDOM.type === "function";
}
