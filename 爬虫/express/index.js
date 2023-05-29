/*
 * @Date: 2023-05-29 18:38:09
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-29 19:02:59
 * @FilePath: /example/爬虫/express/index.js
 * @description: 
 */
const express = require("express")

const request = require("./request")

const app = express()

app.get("/home",async (req,res)=>{
    const {data} = await request.get('https://www.itdjs.com/wp-content/plugins/erphpdown/download.php?postid=1154&&key=1')
    res.send( JSON.stringify(ress.data)  )
})

app.listen(3000,()=>{
    console.log("server is start")
})