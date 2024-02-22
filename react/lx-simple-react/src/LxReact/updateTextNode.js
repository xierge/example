/*
 * @Date: 2024-02-21 23:49:22
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-21 23:51:00
 * @FilePath: /lx-simple-react/src/LxReact/updateTextNode.js
 * @description:
 */
export default function updateTextNode(virtualDOM, oldVirtualDOM, oldDom) {
  if (virtualDOM.props.textContent !== oldVirtualDOM.props.textContent) {
    oldDom.textContent = virtualDOM.props.textContent;
    oldDom._virtualDOM = virtualDOM;
  }
}
