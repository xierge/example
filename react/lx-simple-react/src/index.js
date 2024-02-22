/*
 * @Date: 2024-02-20 11:31:26
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-22 12:49:49
 * @FilePath: /lx-simple-react/src/index.js
 * @description:
 */
import LxReact from "./LxReact";

const root = document.getElementById("root");

const virtualDOM = (
  <div className="container">
    <h1 className="a">你好 lx</h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <button onClick={() => alert("你好")}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
    <input type="text" value="13" />
  </div>
);

const modifyDOM = (
  <div className="container">
    <h1 className="b">你好 lsq</h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <button onClick={() => alert("你好2222")}>点击我</button>
    <h6>这个将会被删除</h6>
    2, 3
    <input type="text" value="13" />
  </div>
);

console.log(virtualDOM);
LxReact.render(virtualDOM, root);
// setTimeout(() => {
//   LxReact.render(modifyDOM, root);
// }, 2000);

// const Demo = () => <span>Demo</span>;
const Heart = ({ title }) => (
  <div>
    <h1>{title}</h1>
  </div>
);
// LxReact.render(<Heart title="hello lx" />, root);

class Alert extends LxReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "lx",
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    // this.setState({
    //   name: "lsq",
    // });
    console.log(this.input.value);
  }
  render() {
    return (
      <div>
        hello alert
        <h1> {this.props.title}</h1>
        <input ref={(input) => (this.input = input)} type="text"></input>
        <button onClick={this.handleClick}>{this.state.name}</button>
      </div>
    );
  }
}

LxReact.render(<Alert title="hello lx" />, root);
// setTimeout(() => {
//   LxReact.render(<Alert title="hello lsq " />, root);
// }, 2000);
