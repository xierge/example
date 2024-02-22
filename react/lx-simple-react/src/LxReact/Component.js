/*
 * @Date: 2024-02-21 16:12:49
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 01:56:02
 * @FilePath: /lx-simple-react/src/LxReact/Component.js
 * @description:
 */
import diff from "./diff";
export default class Component {
  constructor(props) {
    this.props = props;
  }
  setState(state) {
    this.state = Object.assign({}, this.state, state);
    const virtualDOM = this.render();

    let oldDom = this.getDom();
    const container = oldDom.parentNode;
    diff(virtualDOM, container, oldDom);
  }

  setDom(dom) {
    this._dom = dom;
  }

  getDom() {
    return this._dom;
  }

  updateProps(props) {
    this.props = props;
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  componentWillUpdate() {}
  componentDidUpdate() {}
  componentWillMount() {}
  componentWillUnmount() {}
}
