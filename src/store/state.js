const state = {
  // 是否登录
  isLogin:localStorage.getItem('isLogin') ? JSON.parse(localStorage.getItem('isLogin')) :false,
  // 用户信息 如果缓存中有就取出来，没有则为空
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  // 用户私人歌单
  userSongList:localStorage.getItem('userSongList') ? JSON.parse(localStorage.getItem('userSongList')) : [],
  // 用户的关注列表
  userFollowsList:[],
  // 用户的收藏
  subAlbumlist:[],
  subSingerlist:[],
  subMvlist:[],

  /* 音乐播放 */
  // 音乐播放状态
  isPlaying: false,
  //播放模式
  playModel:localStorage.getItem('playModel') ? JSON.parse(localStorage.getItem('playModel')) : 1,
   //当前歌曲url
  songUrl:" ",
  // 当前歌曲详情
  nowSongDetail:{},
  //正在播放列表
  playingList:[],
  // 历史播放列表
  historyPlay:localStorage.getItem('historyPlay') ? JSON.parse(localStorage.getItem('historyPlay')) : [],
  // 是否显示当前歌曲详情页
  isShowSongDetail:false,
  // 当前歌曲播放的实时秒数
  currentSecond:null,
  
};
export default state;
