/*
 * @Date: 2023-05-03 18:35:54
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-03 18:50:40
 * @FilePath: /example/gulp/demo/gulpfile.js
 * @description:
 */
const { src, dest, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const swig = require("gulp-swig");
exports.style = () => {
    return src("src/assets/styles/**.scss", { base: "src" })
        .pipe(sass())
        .pipe(dest("dist"));
};

exports.page = () => {
    return src("src/*.html", { base: "src" })
        .pipe(swig(defaults: { cache: false }));
};
