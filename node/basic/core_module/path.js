/*
 * @Date: 2024-02-02 11:36:26
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-02-02 23:09:59
 * @FilePath: /Desktop/example/node/basic/core_module/path.js
 * @description: path
 */

//  basename():获取路径中基础名称
//  dirname():获取路径中的目录名称
//  extname():获取路径中的扩展名称
//  isAbsolute:获取路径是否为绝对路径
//  join(): 拼接多个路径片段
//  resolve():返回绝对路径
//  parse():解析路径
//  format():序列化路径
//  normalize():规范化路径
const path = require("path");

console.log(path.basename("a/b/c.txt")); // c.txt
console.log(path.dirname("a/b/c.txt")); // a/b
console.log(path.extname("a/b/c.txt")); // .txt
console.log(path.isAbsolute("a/b/c.txt")); // false
console.log(path.isAbsolute("/a/b/c.txt")); // true
console.log(path.join("a/b", "c.txt")); // a/b/c.txt
console.log(path.resolve("a/b", "c.txt")); // /Users/lipengxi/node/a/b/c.txt
console.log(path.parse("a/b/c.txt")); // { root: '', dir: 'a/b', base: 'c.txt', ext: '.txt', name: 'c' }
console.log(
  path.format({
    root: "/ignored",
    dir: "/home/user/dir",
    base: "file.txt",
  })
); // /home/user/dir/file.txt

console.log(path.normalize("/foo/bar//baz/asdf/quux/..")); // /foo/bar/baz/asdf
