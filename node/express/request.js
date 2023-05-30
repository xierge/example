/*
 * @Date: 2023-05-29 18:45:21
 * @LastEditors: 李鹏玺 2899952565@qq.com
 * @LastEditTime: 2023-05-30 14:43:12
 * @FilePath: /example/爬虫/express/request.js
 * @description: 
 */
const axios = require("axios")


const request = axios.create({
    headers:{
        cookie:"PHPSESSID=4c1q7slu3pm94ucn7soegpha81; wordpress_test_cookie=WP%20Cookie%20check; wordpress_logged_in_7a3afe25d4915108ac3f328da201be3e=lpx1%7C1688020678%7C7p6z1EfrT6Vf2qq5fFTXccLVfGijnYRyYrZkkicP4eq%7C39ccdceccf7ae1c605cd847c4fbea5477f75951f341a09bd86d5fb1e827061f9"
    }
})


module.exports = request