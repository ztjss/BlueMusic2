import {request} from "../request";
// 手机号登录
export function login(phone,password){
    return request({
        url:'/login/cellphone',
        params:{
            phone,
            password
        }
    })
}

// 二维码登录
// 获取二维码key
export function getQrKey(timestamp){
    return request({
        url:'/login/qr/key',
        params:{
            timestamp
        }
    })
}
// 生成二维码
export function getLoginQr(key,timestamp){
    return request({
        url:'/login/qr/create',
        params:{
            key,
            timestamp,
            qrimg:true
        }
    })
}
// 检查二维码状态
export function checkLoginQr(key,timestamp){
    return request({
        url:'/login/qr/check',
        params:{
            key,
            timestamp
        }
    })
}

// 获取用户账号信息
export function getUserAccount(timestamp){
    return request({
        url:'/user/account',
        params:{
            timestamp
        }
    })
}
// 签到
export function dailySignin(){
    return request({
        url:'/daily_signin',
        params:{
            type:1
        }
    })
}

// 退出登录
export function logout(){
    return request({
        url:'/logout'
    })
}


