import {request} from "../request";
// 获取用户详情
export function getUserDetail(uid){
    return request({
        url:'/user/detail',
        params:{
            uid,
            timestamp:Date.parse(new Date()),
        }
    })
}
// 获取用户歌单
export function getUserSonglist(uid){
    return request({
        url:'/user/playlist',
        params:{
            uid,
            timestamp:Date.parse(new Date()),
            limit:1000,
        }
    })
}

// 获取用户关注列表
export function getUserFollows(uid,offset,limit){
    return request({
        url:'/user/follows',
        params:{
            uid,
            offset,
            limit,
            timestamp:Date.parse(new Date()),
            
        }
    })
}
//获取用户粉丝列表
export function getUserFolloweds(uid,offset,limit=48){
    return request({
        url:'/user/followeds',
        params:{
            uid,
            offset,
            limit
        }
    })
}
// 获取用户播放记录信息
export function getUserRecord(uid,type){
    return request({
        url:'/user/record',
        params:{
            uid,
            type
        }
    })
}
// 获取用户动态
export function getUserEvent(uid){
    return request({
        url:'/user/event',
        params:{
            uid,
            limit:40
        }
    })
}
// 关注用户
export function subUser(t,id){
    return request({
        url:'/follow',
        params:{
            t,
            id
        }
    })
}
