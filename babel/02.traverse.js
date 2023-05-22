/*
 * @Author       : 李鹏玺 2899952565@qq.com
 * @Date         : 2023-05-22 15:19:43
 * @LastEditors  : 李鹏玺 2899952565@qq.com
 * @LastEditTime : 2023-05-22 15:23:55
 * @FilePath     : /02.traverse.js
 * @Description  :
 */

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const generator = require("@babel/generator").default;

// 源代码
const sourceCode = `
const hello = () => {};
`;

// 构建抽象语法树 AST
const ast = parser.parse(sourceCode);

// 对抽象语法树内容进行修改
traverse(ast, {
  // 三种写法
  // 1. enter exit
  //   enter: (path) => {
  //     if (path.isIdentifier({ name: "hello" })) {
  //       path.node.name = "lx";
  //     }
  //   },
  //   exit: (path) => {},
  // 2.可以直接通过节点的类型操作AST节点
  // Identifier: (path) => {
  //   path.node.name = "xx";
  // },
  // VariableDeclaration: (path) => {},
  // 3. |
  "FunctionDeclaration|VariableDeclaration"(path) {},
});

// path的属性
// path {
//   node // 当前 AST 节点
//   parent // 父 AST 节点
//   parentPath // 父 AST 节点的 path
//   scope // 作用域
//   hub // 可以通过 path.hub.file 拿到最外层 File 对象， path.hub.getScope 拿到最外层作用域，path.hub.getCode 拿到源码字符串
//   container // 当前 AST 节点所在的父节点属性的属性值
//   key // 当前 AST 节点所在父节点属性的属性名或所在数组的下标
//   listKey // 当前 AST 节点所在父节点属性的属性值为数组时 listkey 为该属性名，否则为 undefined
// }

// 重新生成code
const { code } = generator(ast);
console.log(code);
