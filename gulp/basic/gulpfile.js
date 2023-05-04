/*
 * @Date: 2023-05-03 14:17:55
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-03 17:42:00
 * @FilePath: /example/gulp/basic/gulpfile.js
 * @description:
 */

// --------------basic-------------
// function defaultTask(cb) {
//   // place code for your default task here
//   console.log("lx");
//   cb();
// }

// exports.default = defaultTask;
// const gulp = require("gulp");
// gulp.task("lx", (done) => {
//   console.log("lsq");
//   done();
// });

// -----------组合任务-------------
// const { series, parallel } = require("gulp");

// const task1 = (done) => {
//   setTimeout(() => {
//     console.log("task1");
//     done();
//   }, 1000);
// };

// const task2 = (done) => {
//   setTimeout(() => {
//     console.log("task2");
//     done();
//   }, 1000);
// };

// exports.default = parallel(task1, task2);

// -----------异步任务------------
// 1. 通过 done 参数
// 成功
exports.callback = (done) => {
  console.log("callback");
  done();
};
// [17:27:54] Starting 'callback'...
// callback
// [17:27:54] Finished 'callback' after 811 μs

// 失败
exports.callback_error = (done) => {
  console.log("callback_error");
  done(new Error("callback_error"));
};
// [17:29:18] Starting 'callback_error'...
// callback_error
// [17:29:18] 'callback_error' errored after 781 μs
// [17:29:18] Error: callback_error

// 2. 通过 Promise
// 成功
exports.promise = () => {
  console.log("promise");
  return Promise.resolve("promise");
};
// [17:32:22] Starting 'promise'...
// promise
// [17:32:22] Finished 'promise' after 992 μs

// 失败
exports.promise_error = () => {
  console.log("promise_error");
  return Promise.reject("promise_error");
};
// [17:34:19] Starting 'promise_error'...
// promise_error
// [17:34:19] 'promise_error' errored after 1.02 ms
// [17:34:19] Error: promise_error

// 3. 返回 readStream
const fs = require("fs");
exports.stream = (done) => {
  const readStream = fs.createReadStream("package.json");
  const writeStream = fs.createWriteStream("package.txt");
  readStream.pipe(writeStream);
  // readStream.on("end", () => {
  //   done();
  // });
  return readStream;
};

// 4. async
const timer = (time) => new Promise((resolve) => setTimeout(resolve, time));
exports.async = async () => {
  await timer(1000);
  console.log("async");
};
// [17:41:19] Starting 'async'...
// async
// [17:41:20] Finished 'async' after 1 s
