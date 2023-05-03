/*
 * @Date: 2023-05-03 18:25:32
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-03 18:29:02
 * @FilePath: /example/gulp/files-api/gulpfile.js
 * @description:
 */
const { src, dest } = require("gulp");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");

exports.default = () => {
  return src("src/**.css")
    .pipe(cleanCSS())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest("dist"));
};
