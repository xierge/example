/*
 * @Date: 2023-05-03 17:54:56
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-03 18:05:10
 * @FilePath: /example/gulp/build-process/gulpfile.js
 * @description:
 */
const fs = require("fs");
const { Transform } = require("stream");
exports.default = () => {
  // 文件读取流
  const readStream = fs.createReadStream("normalize.css");

  // 文件写入流
  const writeStream = fs.createWriteStream("normalize.min.css");

  // 文件转换流
  const transformStream = new Transform({
    // 核心转换过程
    transform: (chunk, encoding, callback) => {
      const input = chunk.toString();
      const output = input.replace(/\s+/g, "").replace(/\/\*.+?\*\//g, "");
      callback(null, output);
    },
  });

  return readStream.pipe(transformStream).pipe(writeStream);
};
