import {request} from "../request";
// 登录
export function login(phone,password){
    return request({
        url:'/login/cellphone',
        params:{
            phone,
            password
        }
    })
}
// 退出
export function logout(){
    return request({
        url:'/logout'
    })
}
// 获取用户歌单
export function getUserSonglist(uid){
    return request({
        url:'/user/playlist',
        params:{
            uid
        }
    })
}


