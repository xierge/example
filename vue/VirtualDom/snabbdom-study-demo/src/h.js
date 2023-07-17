/*
 * @Date: 2023-07-17 17:32:19
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-07-17 17:48:50
 * @FilePath: /example/vue/VirtualDom/snabbdom-study-demo/src/h.js
 * @description:
 */
import { vnode } from "snabbdom";
import { isPrimitive } from "../utils";

export function h(sel, data, children) {
  let _children;
  let _data;
  let _text;
  let i = 0;
  if (children !== undefined) {
    if (data !== null) {
      _data = data;
      if (Array.isArray(children)) {
        _children = children;
      } else if (isPrimitive(children)) {
        _text = children.toString();
      } else if (children && children.sel) {
        _children = [children];
      }
    }
  } else if (data) {
    if (Array.isArray(data)) {
      _children = data;
    } else if (isPrimitive(data)) {
      _text = data.toString();
    } else if (data && data.sel) {
      _children = [data];
    } else {
      _data = data;
    }
  }

  if (_children !== undefined) {
    for (i = 0; i < _children.length; i++) {
      if (isPrimitive(_children[i])) {
        _children[i] = vnode(
          undefined,
          undefined,
          undefined,
          _children[i],
          undefined
        );
      }
    }
  }
  return vnode(sel, _data, _children, _text, undefined);
}
