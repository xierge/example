/*
 * @Date: 2023-10-10 16:32:54
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-10-10 16:42:22
 * @FilePath: /example/basic_js/getType.js
 * @description: 获取数据类型
 */
function getType(params){
    let type = typeof params
    if(type !== 'object') return type.slice(0,1).toUpperCase() + type.slice(1)

    return Object.prototype.toString.call(params).replace(/^\[object (\S+)\]$/,'$1')
}

console.log(getType(new Date()))
console.log(getType(1))