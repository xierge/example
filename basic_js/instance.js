/*
 * @Date: 2023-10-10 15:39:22
 * @LastEditors: Carlos 2899952565@qq.com
 * @LastEditTime: 2023-10-10 16:09:21
 * @FilePath: /example/basic_js/instance.js
 * @description:  instanceof
 */
function myInstanceOf(left,right){
    if(typeof left !== 'object' || left === null ){
        return false
    }

    let proto = Object.getPrototypeOf(left)
    while(true){
        if(proto === null) return false
        if(proto === right.prototype){
            return true
        }else{
            proto = Object.getPrototypeOf(proto)
        }
    }
}

console.log(myInstanceOf(new Number(123),Number))