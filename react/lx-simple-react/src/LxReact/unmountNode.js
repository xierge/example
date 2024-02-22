/*
 * @Date: 2024-02-22 00:45:28
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 15:44:41
 * @FilePath: /lx-simple-react/src/LxReact/unmountNode.js
 * @description:
 */
export default function unmountNode(node) {
  const virtualDOM = node._virtualDOM;

  if (virtualDOM.type === "text") {
    node.remove();
    return;
  }

  let component = virtualDOM.component;
  if (component) {
    component.componentWillUnmount();
  }

  if (virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(null);
  }

  Object.keys(virtualDOM.props).forEach((attrName) => {
    if (attrName.startsWith("on")) {
      node.removeEventListener(
        attrName.toLowerCase().slice(2),
        virtualDOM.props[attrName]
      );
    }
  });

  if (node.childNodes.length) {
    for (let i = 0; i < node.childNodes.length; i++) {
      unmountNode(node.childNodes[i]);
      i--;
    }
  }

  node.remove();
}
