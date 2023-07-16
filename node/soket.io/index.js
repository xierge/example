/*
 * @Date: 2023-07-16 17:54:40
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-07-17 00:25:38
 * @FilePath: /example/node/soket.io/index.js
 * @description: 
 */
const express = require("express")

const app = express()

const http = require("http")
const server = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(server)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

io.on("connection", socket => {
    console.log("a user connected")
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on("chat message", (res) => {
        console.log(res)
    })

})

server.listen(3000, () => {
    console.log(`server is start `)
})

