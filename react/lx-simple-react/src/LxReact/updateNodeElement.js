/*
 * @Date: 2024-02-21 15:28:22
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 00:25:18
 * @FilePath: /lx-simple-react/src/LxReact/updateNodeElement.js
 * @description:
 */
export default function updateNodeElement(
  newElement,
  virtualDOM,
  oldVirtualDOM
) {
  // 获取节点的属性对象
  const newProps = virtualDOM?.props || {};
  const oldProps = oldVirtualDOM?.props || {};

  Object.keys(newProps).forEach((propName) => {
    const newPropsValue = newProps[propName];
    const oldPropsValue = oldProps[propName];

    if (newPropsValue !== oldPropsValue) {
      // 判断属性是否是事件属性
      if (propName.startsWith("on")) {
        // 事件名称
        const eventName = propName.toLocaleLowerCase().slice(2);
        // 为元素添加事件
        newElement.addEventListener(eventName, newPropsValue);

        // 删除旧事件处理函数
        oldPropsValue &&
          newElement.removeEventListener(eventName, oldPropsValue);
      } else if (propName === "value" || propName === "checked") {
        newElement[propName] = newPropsValue;
      } else if (propName !== "children") {
        if (propName === "className") {
          newElement.setAttribute("class", newPropsValue);
        } else {
          newElement.setAttribute(propName, newPropsValue);
        }
      }
    }
  });

  Object.keys(oldProps).forEach((propName) => {
    const newPropsValue = newProps[propName];
    const oldPropsValue = oldProps[propName];
    if (!newPropsValue) {
      if (propName.startsWith("on")) {
        // 事件名称
        const eventName = propName.toLocaleLowerCase().slice(2);

        // 删除旧事件处理函数
        oldPropsValue &&
          newElement.removeEventListener(eventName, oldPropsValue);
      } else if (propName !== "children") {
        newElement.removeAttribute(propName);
      }
    }
  });
}
