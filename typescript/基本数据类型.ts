let num = 1;

const n = 1


let num1: number;


let u: undefined = undefined
let unusable: void = undefined;


let obj: object = { name: "Carlos" }




interface IUserInfo {
    username: string;
    token: string;
    email: string;
    channelDescription?: string;
    avatar?: string;
    [key: string]: string | undefined;
}

let userInfo: IUserInfo = {
    username: "Carlos",
    token: "ewasdadasdfvjhjafhklajsfdhieoidfio",
    email: "289999@qq.com",
    sex: "man"
}


let user: any = {}
console.log(user.name)



// function getSum(a: number, b: number): number {
//     return a + b
// } 

// const getSum: (a: number, b: number) => number = (a, b) => a + b


interface ICar {
    color:string;
    alert():void
}

class Car implements ICar{
    constructor(public color:string){

    }

    alert(): void {
        console.log(111)
    }
}


function fun<T>(arg:T):T{
    return arg
}   

fun<number>(1)
fun<string>("1")



interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
loggingIdentity([1,2])


const oMap = new Map<string,string>()
oMap.set("username","xizige")
console.log(oMap)

