/*
 * @Date: 2023-06-29 16:20:37
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-06-29 18:14:03
 * @FilePath: /example/css/index.js
 * @description: 
 */
const childProcess = require("child_process");

const fs = require("fs");

const path = require("path");

function exec(command, callback) {
  childProcess.exec(
    command,
    function (err, stdout) {
      if (!err) {
        callback("编译成功");
      }
    }
  );
}

fs.readdir(path.posix.resolve(__dirname, "src"), (err, demos) => {
  demos.forEach((demo) => {
    const common = path.resolve(__dirname, "src", demo);
    exec(`npx sass ${common}/index.scss ${common}/index.css`,res=>console.log(res));

    fs.watchFile(path.resolve(common, "index.scss"), () => {
      exec(`npx sass ${common}/index.scss ${common}/index.css`,res=>console.log(res));
    });
  });
});
