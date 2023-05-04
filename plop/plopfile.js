/*
 * @Date: 2023-04-29 01:26:28
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-02 11:30:48
 * @FilePath: /example/plop/plopfile.js
 * @description:
 */
module.exports = function (plop) {
  plop.setGenerator("component", {
    description: "create a component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "component name",
        default: "LxComponent",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{name}}/{{name}}.js",
        templateFile: "templates/reactComponent.hbs",
      },
      {
        type: "add",
        path: "src/components/{{name}}/{{name}}.css",
        templateFile: "templates/reactCss.hbs",
      },
    ],
  });
};
