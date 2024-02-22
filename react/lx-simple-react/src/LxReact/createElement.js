/*
 * @Date: 2024-02-20 13:55:49
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 13:35:31
 * @FilePath: /lx-simple-react/src/LxReact/createElement.js
 * @description: React.CreateElement
 */

/**
 * @description: 创建Virtual DOM
 * @param {*} type 类型
 * @param {*} props 属性
 * @param {array} children 子元素
 * @return {*} Virtual DOM
 */
function createElement(type, props, ...children) {
  const childElements = [].concat(children).reduce((pre, cur) => {
    if (cur !== false && cur !== null && cur !== true) {
      if (cur instanceof Object) {
        pre.push(cur);
      } else {
        // 文本节点
        pre.push(createElement("text", { textContent: cur }));
      }
    }
    return pre;
  }, []);

  return {
    type,
    props: Object.assign({ children: childElements }, props),
    children: childElements,
  };
}

export default createElement;
