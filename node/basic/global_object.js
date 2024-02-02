/*
 * @Date: 2024-01-02 17:09:28
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2024-01-08 21:18:39
 * @FilePath: /example/node/basic/global_object.js
 * @description: Node 环境全局对象
 */

// 文件所在目录  __direname
console.log(__dirname);
// /Users/lipengxi/Desktop/example/node/basic

// 文件的绝对路径
console.log(__filename);
// /Users/lipengxi/Desktop/example/node/basic/global_object.js

// this
{
  console.log(this); // 默认情况下this是空对象 {}
  // console.log(global) // global 全局对象
  console.log(this === global); // false

  (function () {
    console.log(arguments);
    console.log(this === global); // true
  })();
}

// process
{
  // 1. cup内存
  console.log(process.memoryUsage());
  // {
  //   rss: 30031872,
  //   heapTotal: 4964352,
  //   heapUsed: 4102896,
  //   external: 403347,
  //   arrayBuffers: 11158
  // }
  // heapTotal 和 heapUsed 指的是 V8 的内存使用量。
  // external 指的是绑定到 V8 管理的 JavaScript 对象的 C++ 对象的内存使用量
  // rss，常驻集大小，是进程在主内存设备（即总分配内存的子集）中占用的空间量，包括所有 C++ 和 JavaScript 对象和代码。
  // arrayBuffers 是指为 ArrayBuffer 和 SharedArrayBuffer 分配的内存
  console.log(process.cpuUsage());

  // 2. 运行环境，node环境，cpu架构，用户环境，系统平台
  console.log(process.cwd());
  console.log(process.version);
  console.log(process.versions);
  console.log(process.arch); // 二进制文件的操作系统 CPU 架构 'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、以及 'x64'
  console.log(process.env.NODE_ENV);
  console.log(process.env.PATH); // 环境变量
  console.log(process.env.HOME); // /Users/lipengxi
  console.log(process.platform); // 返回用于标识编译 Node.js 二进制文件的操作系统平台的字符串 aix  darwin  freebsd  linux  openbsd  sunos  win32

  // 3. 运行状态  启动参数、PID、运行时间
  console.log(process.argv);
  console.log(process.argv0);
  console.log(process.pid); // 当前进程的父进程的 PID
  console.log(process.uptime()); // 当前 Node.js 进程已经运行的秒数。

  // 4. 时间监听
  // process.on("exit", (code) => {
  // 只能写同步代码
  //   console.log("exit" + code);
  // });

  // process.on("beforeExit", (code) => {
  // 可以写异步代码
  //   console.log("beforeExit" + code);
  // });

  // console.log("代码执行完毕 ");a

  // process.exit(); //只会走exit的监听事件 不走beforeExit

  // 5. 标准输出 输入 错误

  // stdout 命令行输出内容
  function logger(data) {
    process.stdout.write(`ERROR:${data}` + "\n");
  }

  const fs = require("fs");
  // 将 test.txt 文件内容打印出来
  fs.createReadStream("test.txt").pipe(process.stdout);

  // stdin 命令行输入内容
  process.stdin.pipe(process.stdout);
  process.stdin.setEncoding("utf-8");
  process.stdin.on("readable", () => {
    let chunk = process.stdin.read();
    logger(chunk);
    // process.stderr("error");
  });
}
