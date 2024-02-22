/*
 * @Date: 2024-02-22 01:39:38
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 01:54:03
 * @FilePath: /lx-simple-react/src/LxReact/updateComponent.js
 * @description:
 */
import diff from "./diff";
export default function updateComponent(
  virtualDOM,
  oldComponent,
  oldDom,
  container
) {
  oldComponent.componentWillReceiveProps(virtualDOM.props);

  if (oldComponent.shouldComponentUpdate(virtualDOM.props)) {
    // 未更新前的props
    let prevProps = oldComponent.props;
    oldComponent.componentWillUpdate(virtualDOM.props);
    // 组件更新
    oldComponent.updateProps(virtualDOM.props);

    let nextVirtualDOM = oldComponent.render();
    nextVirtualDOM.component = oldComponent;
    diff(nextVirtualDOM, container, oldDom);

    oldComponent.componentDidUpdate(prevProps);
  }
}
