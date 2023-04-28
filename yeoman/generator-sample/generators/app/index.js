// 此文件为 generator 的核心入口
const Genrator = require('yeoman-generator');

module.exports = class extends Genrator {
    // 询问用户，可使用this.prompt()方法
    prompting(){
        return this.prompt([
            {
                type:"input",
                name:"username",
                message:"请输入你的姓名",
                default:this.appname // appname 为项目生成的目录名称
            },
            {
                type:"input",
                name:"age",
                message:"请输入你的年龄"
            },
        ]).then(answer=>{
            this.answer = answer
        })
    }


    // 写入文件
    write() {
        // this.fs.write("./lx.txt",Math.random()+"")

        // 获取文件所在路径 默认指向templates文件夹
        const tml = this.templatePath('sample.txt')
        // 编写文件输出路径
        const output = this.destinationPath('sample.txt')
        // 传入模版的变量
        const context = this.answer
        // 生成文件
        this.fs.copyTpl(tml, output, context)
    }

    
}