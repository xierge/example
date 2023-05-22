/*
 * @Author       : 李鹏玺 2899952565@qq.com
 * @Date         : 2023-05-22 15:01:12
 * @LastEditors  : 李鹏玺 2899952565@qq.com
 * @LastEditTime : 2023-05-22 15:18:23
 * @FilePath     : /01.parser.js
 * @Description  :
 */

const parser = require("@babel/parser");
const generator = require("@babel/generator").default;

// 源代码
const sourceCode = `
// 注释内容
const hello:any = () => {};
`;

const ast = parser.parse(sourceCode, {
  // 等一系列属性
  sourceType: "script", // 指示应在其中解析代码的模式 可以是“script”、“module”或“unambiguous”之一。默认为“script”。
  attachComment: false, // 是否保留注释
  strictMode: true,
  plugins: ["typescript"],
});

const { code } = generator(ast);
console.log(code);
