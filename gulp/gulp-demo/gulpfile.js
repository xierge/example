/*
 * @Date: 2023-05-03 18:35:54
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-04 23:42:21
 * @FilePath: /example/gulp/gulp-demo/gulpfile.js
 * @description:
 */
const { src, dest, series, parallel, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const del = require("del");
const loadPlugins = require("gulp-load-plugins");
const plugins = loadPlugins();

const browserSync = require("browser-sync");
const bs = browserSync.create();

const presets = require("@babel/preset-env");

console.log(presets, "presets");

const data = {
  menus: [
    {
      name: "Home",
      icon: "aperture",
      link: "index.html",
    },
    {
      name: "Features",
      link: "features.html",
    },
    {
      name: "About",
      link: "about.html",
    },
    {
      name: "Contact",
      link: "#",
      children: [
        {
          name: "Twitter",
          link: "https://twitter.com/w_zce",
        },
        {
          name: "About",
          link: "https://weibo.com/zceme",
        },
        {
          name: "divider",
        },
        {
          name: "About",
          link: "https://github.com/zce",
        },
      ],
    },
  ],
  pkg: require("./package.json"),
  date: new Date(),
};

const style = () => {
  return src("src/assets/styles/**.scss", { base: "src" })
    .pipe(sass())
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

// gulp-babel: https://www.npmjs.com/package/gulp-babel
const script = () => {
  return src("src/assets/scripts/**.js", { base: "src" })
    .pipe(plugins.babel({ presets: ["@babel/env"] }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

const page = () => {
  return src("src/*.html", { base: "src" })
    .pipe(plugins.swig({ data, defaults: { cache: false } }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

// gulp-imagemin : ^6.1.0
const image = () => {
  return src("src/assets/images/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

const font = () => {
  return src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};

// del : ^6.0.0,
const clean = () => {
  return del(["dist", "temp"]);
};

const useref = () => {
  return (
    src("temp/*.html", { base: "temp" })
      .pipe(plugins.useref({ searchPath: ["temp", "."] }))
      // html js css
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          })
        )
      )
      .pipe(dest("dist"))
  );
};

const compile = parallel(style, script, page);

const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);

const serve = () => {
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);

  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );
  bs.init({
    notify: false,
    port: 2080,
    server: {
      baseDir: ["temp", "src", "public"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

const develop = series(compile, serve);

module.exports = {
  clean,
  build,
  develop,
};
