/*
 * @Author       : 李鹏玺 2899952565@qq.com
 * @Date         : 2023-05-18 11:13:34
 * @LastEditors  : 李鹏玺 2899952565@qq.com
 * @LastEditTime : 2023-05-22 14:06:37
 * @FilePath     : /index.js
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
  // enter:(path)=>{
  //     if(path.isIdentifier({name:'hello'})){
  //         path.node.name = 'lx'
  //     }
  // },
  Identifier: (path) => {
    path.node.name = "xx";
  },
});

// 重新生成code
const { code } = generator(ast);
console.log(code);
