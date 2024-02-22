/*
 * @Date: 2024-02-21 15:46:18
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 02:07:21
 * @FilePath: /lx-simple-react/src/LxReact/mountComponent.js
 * @description:
 */
import isFunction from "./isFunction";
import isFunctionComponent from "./isFunctionComponent";
import mountElement from "./mountElement";
import mountNativeElement from "./mountNativeElement";
export default function mountComponent(virtualDOM, container, oldDom) {
  let nextVirtualDOM;
  let component = null;
  // 判断组建是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    nextVirtualDOM = buildFunctionComponent(virtualDOM);
  } else {
    nextVirtualDOM = buildClassComponent(virtualDOM);
    component = nextVirtualDOM.component;
  }
  component && component?.componentDidMount();
  component && component?.props?.ref?.(component);

  if (isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container, oldDom);
  } else {
    mountNativeElement(nextVirtualDOM, container, oldDom);
  }
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {});
}

function buildClassComponent(virtualDOM) {
  const component = new virtualDOM.type(virtualDOM.props || {});
  const nextVirtualDOM = component.render();
  nextVirtualDOM.component = component;
  return nextVirtualDOM;
}
