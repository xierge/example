const childProcess = require("child_process");

const fs = require("fs");

const path = require("path");

function exec(command, callback) {
  childProcess.exec(
    `npx sass ${common}/index.scss ${common}/index.css`,
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
    exec(`npx sass ${common}/index.scss ${common}/index.css`);

    fs.watchFile(path.resolve(common, "index.scss"), () => {
      exec(`npx sass ${common}/index.scss ${common}/index.css`);
    });
  });
});
