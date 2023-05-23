/*
 * @Date: 2023-05-24 00:48:06
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-24 00:52:19
 * @FilePath: /example/webpack/origin-code/webpack5/plugin/removeComment.js
 * @description: 
 */
class RemoveCommentsPlugin {
    apply(compiler) {
        // emit钩子是输出 asset 到 output 目录之前执行
        compiler.hooks.emit.tap("RemoveCommentsPlugin", compilation => {
            for (const name in compilation.assets) {
                if (name.endsWith(".js")) {
                    const contents = compilation.assets[name].source()
                    const noComments = contents.replace(/\/\*{2,}\/\s?/g, "")
                    compilation.assets[name] = {
                        source: () => noComments,
                        size: () => noComments.length
                    }
                }
            }
        })
    }
}
module.exports = RemoveCommentsPlugin