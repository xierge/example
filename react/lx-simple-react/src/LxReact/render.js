import diff from "./diff";

/**
 * @description: 将virtualDOM渲染到真实dom中
 * @param {*} virtualDOM 虚拟DOM
 * @param {*} container 真实DOM
 * @param {*} oldDom 旧DOM
 * @return {*}
 */
function render(virtualDOM, container, oldDom = container.firstChild) {
  diff(virtualDOM, container, oldDom);
}

export default render;
