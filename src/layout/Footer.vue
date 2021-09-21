<template>
  <div id="footer">
    <div class="player">
      <!-- 音频标签 -->
      <audio
        autoplay
        :src="songUrl"
        ref="audioplay"
        @play="changeState(true)"
        @pause="changeState(false)"
        @loadedmetadata="onLoadedmetadata"
        @timeupdate="onTimeupdate"
        @ended="getNextSong"
      ></audio>
      <!-- 左侧歌曲封面 名字 -->
      <div class="left-cover-content">
        <!-- 有音乐时 -->
        <div
          class="cover-content"
          v-if="Object.keys(nowSongDetail).length !== 0"
        >
          <div class="cover" @click="showSongDetail">
            <img :src="nowSongDetail.al.picUrl" alt="" />
          </div>
          <div class="songname">
            <p style="padding-bottom:5px">{{ nowSongDetail.name }}</p>
            <p class="by">{{ nowSongDetail.ar[0].name }}</p>
          </div>
          <!-- 喜欢该歌曲 -->
          <div class="like-song" @click="likeNowSongBy">
            <span
              ><i class="iconfont icon-like" :class="{ like: islike }"></i
            ></span>
          </div>
        </div>
        <!-- 没有音乐时 -->
        <div
          class="cover-content"
          v-if="Object.keys(nowSongDetail).length == 0"
          @click="showSongDetail"
        >
          <div class="cover">
            <img src="../assets/imgs/music-icon.png" style="width:130%"/>
          </div>
          <div class="songname">
            暂无音乐
          </div>
        </div>
      </div>

      <div class="change-play">
        <!-- 上一曲 -->
        <span class="change-box" @click="getBackSong">
          <i class="iconfont icon-shangyiqu"></i>
        </span>
        <!-- 播放 暂停 -->
        <span class="play-box" v-if="!isPlaying" @click="playMusic">
          <i class="iconfont icon-play"></i>
        </span>
        <span class="play-box" v-else @click="pauseMusic">
          <i class="iconfont icon-pause"></i>
        </span>
        <!-- 下一曲 -->
        <span class="change-box" @click="getNextSong">
          <i class="iconfont icon-xiayiqu"></i>
        </span>
      </div>
      <!-- 歌曲进度条 -->
      <div class="song-progress">
        <!-- 当前歌曲时间 -->
        <span v-if="playingList.length == 0">00:00</span>
        <span v-if="Object.keys(nowSongDetail).length !== 0">{{
          currentTime
        }}</span>
        <!-- 进度条 -->
        <div class="s-progress">
          <el-slider
            v-model="songProgress"
            :format-tooltip="formatTooltip"
            :disabled="playingList.length == 0"
            @change="changeSongProgress"
          ></el-slider>
        </div>
        <span v-if="playingList.length == 0">00:00</span>
        <span v-if="Object.keys(nowSongDetail).length !== 0">{{
          totalTime
        }}</span>
      </div>
      <!-- 播放模式 -->
      <div class="playmodel">
        <span v-if="playModel == 1" @click="changePlayModel(2)">
          <i class="iconfont icon-orderplay"></i>
        </span>
        <span v-if="playModel == 2" @click="changePlayModel(3)">
          <i class="iconfont icon-random"></i>
        </span>
        <span v-if="playModel == 3" @click="changePlayModel(1)">
          <i class="iconfont icon-danqu"></i>
        </span>
        <span>
          <i class="iconfont icon-cibiaoquanyi" @click="showSongDetail"></i>
        </span>
      </div>

      <!-- 右侧声音进度条 -->
      <div class="right-voice">
        <!-- 静音按钮 -->
        <span>
          <i
            class="iconfont icon-jingyin"
            @click="cancelMute"
            v-if="voiceProgress == 0"
          ></i>
          <i class="iconfont icon-laba" @click="muteVolume" v-else></i>
        </span>
        <!-- 声音进度条 -->
        <div class="v-progress">
          <el-slider
            v-model="voiceProgress"
            @change="changeVoiceProgress"
          ></el-slider>
        </div>
        <!-- 播放列表按钮 -->
        <el-tooltip effect="dark" content="播放列表" placement="top">
          <span @click="showPlayingList">
            <i class="iconfont icon-songplaylist"></i>
          </span>
        </el-tooltip>
      </div>
      <!-- 当前播放列表 -->
      <transition name="playlist">
        <PlayingList v-show="isShowDrawer" />
      </transition>
    </div>
  </div>
</template>

<script>
/* 网络请求 */
import {
  getSongUrl,
  likeNowSong,
  getLikSongList,
} from "network/playmusic/playmusic.js";
/* vuex */
import { mapGetters } from "vuex";
/* 格式化时间 */
import { formatDuration } from "../common/formatDuration";
/* 随机数 */
import { getRandom } from "common/getRandom";
/* 子组件 */
import PlayingList from "components/content/player/PlayingList.vue";
export default {
  name: "Footer",
  components: { PlayingList },
  computed: {
    ...mapGetters([
      "userInfo",
      "songUrl",
      "isPlaying",
      "playingList",
      "nowSongDetail",
      "playModel",
    ]),
  },
  data() {
    return {
      isShowDrawer: false, //是否显示播放列表
      totalSecond: "", // 歌曲总秒数
      currentSecond: "", //歌曲当前秒数
      totalTime: "", //歌曲总时长(分钟)
      currentTime: "", //歌曲当前处于的时间(分钟)
      songProgress: "", //歌曲时间进度条
      voiceProgress: 50, //音量进度条
      nowVolume: "", //静音前的音量
      islike: false, //是否喜欢当前播放歌曲
    };
  },
  methods: {
    /* 显示播放列表 */
    showPlayingList() {
      this.isShowDrawer = !this.isShowDrawer;
    },
    /* 显示当前歌曲详情页 */
    showSongDetail() {
      // this.isShowSongDetail = !this.isShowSongDetail;
      this.$store.commit("showSongDetail");
    },
    /* 音频标签事件监听 播放或者暂停 就到vuex改变当前播放状态 */
    changeState(isPlay) {
      this.$store.dispatch("changePlayState", isPlay);
    },
    /* 
    播放 暂停 按钮点击事件
     */
    // 播放音乐
    playMusic() {
      if (this.playingList.length == 0) {
        this.$message({
          message: "播放列表为空",
          type: "warning",
          center: true,
        });
      } else this.$refs.audioplay.play();
    },
    // 暂停音乐
    pauseMusic() {
      this.$refs.audioplay.pause();
    },
    /* 
    音频标签事件监听 
    */
    // 音频数据加载完后的事件
    onLoadedmetadata(res) {
      // console.log(res);
      this.totalSecond = res.target.duration; //获取总秒数
      this.totalTime = formatDuration(res.target.duration); //格式化为分钟
    },
    // 监听时间的改变
    onTimeupdate(res) {
      // console.log(res.target.currentTime);
      this.currentSecond = res.target.currentTime; //当前秒数
      // 提交歌曲播放的实时秒数 用于歌词的实时滚动
      this.$store.dispatch("saveCurrentSeconds", this.currentSecond);
      // 格式化为分钟
      this.currentTime = formatDuration(res.target.currentTime);
      // 歌曲当前时间改变后，时间进度条也要改变
      this.songProgress = Math.floor(
        (this.currentSecond / this.totalSecond) * 100
      );
    },
    // 拖动时间进度条，改变当前时间，
    // len是进度条改变时的回调函数的参数0-100之间，需要换算成实际时间拖动进度条，
    changeSongProgress(len) {
      this.$refs.audioplay.currentTime = Math.floor(
        (len / 100) * this.totalSecond
      );
    },
    // 进度条拖动时，显示当前值,格式化formatTooltip
    formatTooltip(val) {
      return formatDuration((val / 100) * this.totalSecond);
    },

    /* 
    声音按钮事件
     */
    // 静音
    muteVolume() {
      this.nowVolume = this.voiceProgress; //先保存当前音量，用于取消静音时恢复
      this.voiceProgress = 0;
      this.$refs.audioplay.volume = 0;
    },
    // 取消静音
    cancelMute() {
      this.voiceProgress = this.nowVolume;
      this.$refs.audioplay.volume = this.voiceProgress / 100;
    },
    // 拖动音量进度条
    changeVoiceProgress(len) {
      this.voiceProgress = len;
      this.$refs.audioplay.volume = this.voiceProgress / 100; //修改音量
    },

    /* 
    切换歌曲事件
     */
    // 获取当前歌曲索引
    getSongIndex() {
      // 找到当前歌曲在播放列表的索引
      return this.playingList.findIndex((item) => {
        return this.nowSongDetail.id == item.id;
      });
    },
    // 上一曲点击事件
    getBackSong() {
      // 首先判断播放列表不为空
      if (this.playingList.length == 0) {
        this.$message({
          message: "播放列表为空",
          type: "warning",
          center: true,
        });
        return;
      } else if (this.playingList.length == 1) {
        this.playMusic();
      } else {
        // 再根据播放模式判断
        if (this.playModel == 1) {
          this.orderPlayBack();
        } else if (this.playModel == 2) {
          this.randomPlay();
        } else this.loopPlay();
      }
    },
    // 下一曲点击事件
    getNextSong() {
      // 首先判断播放列表不为空
      if (this.playingList.length == 0) {
        this.$message({
          message: "播放列表为空",
          type: "warning",
          center: true,
        });
        return;
      } else if (this.playingList.length == 1) {
        this.playMusic();
      } else {
        // 再根据播放模式判断
        if (this.playModel == 1) {
          this.orderPlayNext();
        } else if (this.playModel == 2) {
          this.randomPlay();
        } else this.loopPlay();
      }
    },

    /*
    播放模式
    */
    // 切换播放模式事件
    changePlayModel(model) {
      // 先关闭循环播放
      this.$refs.audioplay.loop = false;
      this.$store.commit("changePlayModel", model);
      localStorage.setItem("playModel", model);
    },
    //.1 顺序模式
    // 上一曲
    orderPlayBack() {
      let nowIndex = this.getSongIndex();
      let backIndex;
      // 如果当前歌曲处于第一首，则上一首为列表最后一首
      // 否则直接索引减1得到上一首歌的索引号，
      if (nowIndex == 0) {
        backIndex = this.playingList.length - 1;
      } else if (nowIndex == -1) {
        //如果正在播放的歌曲被删除了
        backIndex = 0;
      } else backIndex = nowIndex - 1;
      //根据索引号获取歌曲id 再根据id发送网络请求获取歌曲详情
      let backSong = this.playingList[backIndex];
      let backId = backSong.id;
      // 根据id获取url
      getSongUrl(backId).then((res) => {
        // 保存歌曲url
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
        //提交vuex保存当前歌曲详情
        this.$store.dispatch("saveSongDetail", backSong);
      });
    },
    // 下一曲
    orderPlayNext() {
      let nowIndex = this.getSongIndex();
      let nextIndex;
      if (nowIndex == this.playingList.length - 1) {
        nextIndex = 0;
      } else nextIndex = nowIndex + 1;
      let nextSong = this.playingList[nextIndex];
      let nextId = nextSong.id;
      // 根据id获取url
      getSongUrl(nextId).then((res) => {
        // 保存歌曲url
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
        //提交vuex保存当前歌曲详情
        this.$store.dispatch("saveSongDetail", nextSong);
      });
    },
    //.2随机模式
    randomPlay() {
      // 获得一个随机索引号
      let randomIndex = getRandom(0, this.playingList.length - 1);
      // 根据随机索引号拿到随机歌曲
      let randomSong = this.playingList[randomIndex];
      // 再获得随机歌曲id
      let randomId = randomSong.id;
      // 根据id发送网络请求
      getSongUrl(randomId).then((res) => {
        // 保存歌曲url
        this.$store.dispatch("saveSongUrl", res.data.data[0].url);
        //提交vuex保存当前歌曲详情
        this.$store.dispatch("saveSongDetail", randomSong);
      });
    },
    //.3 单曲循环
    loopPlay() {
      this.$refs.audioplay.loop = true;
      this.playMusic();
    },

    /* 
    喜欢当前播放歌曲
     */
    // 先判断当前播放歌曲是否在我的喜欢列表中
    isLikeNowSong() {
      // 获取喜欢的歌曲id列表
      getLikSongList(this.userInfo.userId).then((res) => {
        let likeSongIds = [];
        // console.log(res);
        likeSongIds = res.data.ids;
        let index = likeSongIds.findIndex((id) => {
          return id == this.nowSongDetail.id;
        });
        if (index == -1) {
          this.islike = false;
          console.log(this.islike);
        } else {
          this.islike = true;
          console.log(this.islike);
        }
      });
    },
    // 点击喜欢按钮的回调
    likeNowSongBy() {
      // 先判断登录状态
      if (!this.$store.state.isLogin) {
        this.$message({
          type: "warning",
          message: "登录后才能收藏",
          showClose: true,
          center: true,
        });
        return;
      }
      let like = this.islike ? false : true;
      likeNowSong(this.nowSongDetail.id, like).then((res) => {
        console.log(res);
        if (like == true) {
          this.$message({
            message: "收藏成功",
            type: "success",
            center: true,
          });
          this.islike = true;
        } else {
          this.$message({
            message: "取消收藏成功",
            type: "success",
            center: true,
          });
          this.islike = false;
        }
      });
    },
  },
  watch: {
    nowSongDetail() {
      if(this.$store.state.isLogin){
        this.isLikeNowSong();
      }
      
    },
  },
};
</script>

<style lang="less" scoped>
#footer {
  width: 100%;
  position: fixed;
  bottom: 0px;
  height: 70px;
  z-index: 99;
  background: #f8f8ff;
  border-top: 1px solid #dddddd;
}
.player {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  .left-cover-content {
    margin-left: 15px;
    width: 18%;
    // border: solid 1px red;
    .cover-content {
      display: flex;
      align-items: center;
      .cover {
        width: 60px;
        img {
          width: 100%;
        }
      }
      .songname {
        margin-left: 10px;
        p {
          width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .like-song {
        margin-left: 20px;
        .icon-like {
          font-size: 18px;
          font-weight: 700;
        }
        .like {
          color: #409eff;
        }
      }
    }
  }
  .change-play {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12%;
    .change-box,
    .play-box {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      background: rgba(64, 158, 255, 0.8);
      border-radius: 50%;
      &:hover {
        background: #409eff;
      }
    }
    .change-box {
      width: 30px;
      height: 30px;
      margin: 0 10px;
    }
    .play-box {
      width: 42px;
      height: 42px;
      padding-left: 2px;
    }
    .icon-shangyiqu,
    .icon-xiayiqu {
      font-size: 18px;
    }
    .icon-play,
    .icon-pause {
      font-size: 22px;
    }
  }
  .song-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60%;
    span {
      padding: 0 10px;
    }
    .s-progress {
      width: 90%;
    }
  }
  .playmodel {
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      width: 25px;
      margin: 0 5px;
      &:hover {
        color: #409eff;
      }
    }
    .icon-orderplay,
    .icon-random {
      font-size: 18px;
      font-weight: 700;
    }
    .icon-danqu,
    .icon-cibiaoquanyi {
      font-weight: 700;
    }
  }
  .right-voice {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20%;
    // border: solid 1px red;
    span {
      padding: 5px 10px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .icon-laba,
    .icon-jingyin {
      font-size: 20px;
      font-weight: 700;
    }
    .icon-songplaylist {
      font-size: 18px;
    }
    .v-progress {
      width: 40%;
    }
  }
  span {
    cursor: pointer;
  }
}

// 播放列表动画
.playlist-enter,
.playlist-leave-to {
  transform: translateX(100%);
}
.playlist-enter-active,
.playlist-leave-active {
  transition: all 0.6s;
}
.playlist-enter-to {
  transform: translateX(0);
}
</style>
