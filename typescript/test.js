const setTime = (val, m) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(val)
        }, m)
    }).then(r => {
        console.log(r)
        return r
    })

const func1 = () => setTime(1, 2000)
const func2 = () => setTime(2, 1000)
const func3 = () => setTime(3, 2000)


exectudePromise([func1, func2, func3]).then((res) => {
    console.log('end')
    console.log(res)
})


function exectudePromise(promiseArr) {
    let length = promiseArr.length
    let arr = []
    function digui(i,resolve){
        promiseArr[i]().then(r => {
            arr.push(r)
            i++
            if (i === length) {
                resolve(arr)
            }else{
                digui(i,resolve)
            }
        })
    }
    return new Promise(resolve => {
        return digui(0,resolve)
    })
}


//1,2,3,'end',[1,2,3]
