<template>
  <div class="song-table">
    <el-table
      stripe
      style="width: 100%;"
      :data="songs"
      empty-text="数据加载中~"
      @row-dblclick="dbSongClick"
      :row-class-name="tableRowClassName"
      @cell-mouse-enter="showOP"
      @cell-mouse-leave="closeOP"
    >
      <el-table-column  width="80">
        <template v-slot="scope">
          <span class="iconfont icon-laba" v-if="scope.row.id == nowSongDetail.id"></span>
          <span v-else>{{scope.row.index | formatIndex }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="歌曲"
        width="300"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          <span
            >{{ scope.row.name }}
            <i class="iconfont icon-vip1" v-if="scope.row.fee == 1"></i>
            <i
              class="iconfont icon-mv"
              v-if="scope.row.mv != 0"
              @click="toMvDetail(scope.row.mv)"
            ></i
          ></span>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <template v-slot="scope">
          <div class="operation" v-show="isShow&&currentIndex==scope.row.index">
            <span
              class="iconfont icon-xihuan"
              @click="likeSong(scope.row)"
            ></span>
            <span class="el-icon-plus" @click="addSong(scope.row)"></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="al.name"
        label="专辑"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          <span @click="toAlbum(scope.row.al.id)" class="sthover">
            {{ scope.row.al.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ar[0].name"
        label="歌手"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          <span @click="toSinger(scope.row.ar[0].id)" class="sthover">
            {{ scope.row.ar[0].name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="dt" label="时长">
        <template v-slot="scope">
          <span>
            {{ scope.row.dt | formatDuration }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getSongUrl,
  checkMusic,
  likeNowSong,
  getLikSongList,
} from "network/playmusic/playmusic.js";
import { mapGetters } from "vuex";
export default {
  name: "SongTable",
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // islike: false,
      isShow: false,
      likeSongIds: [],
      currentIndex:null
    };
  },
  computed: {
    ...mapGetters(["nowSongDetail", "userInfo"]),
    
  },
  filters:{
    formatIndex(index){
      if(index<9){
        return "0"+(index+1);
      }else return index+1
    },
  },
  created() {
    // this.isLikeSong();
  },
  methods: {
    //鼠标移入移出
    // 每行显示操作按钮
    showOP(row){
      this.currentIndex=row.index;
        this.isShow=true;
      
    },
    closeOP(){
      this.isShow=false
    },
    //每行歌曲双击事件
    dbSongClick(song) {
      // 先检查歌曲是否可用
      checkMusic(song.id)
        .then((res) => {
          // 获取歌曲url
          getSongUrl(song.id).then((res) => {
            this.$store.dispatch("saveSongUrl", res.data.data[0].url);
          });
          //提交vuex保存当前歌曲详情
          this.$store.dispatch("saveSongDetail", song);
          // 提交vuex添加到播放列表
          this.$store.dispatch("addPlayinglist", song);
        })
        .catch((err) => {
          // console.log(err.response.data);
          this.$message({
            message: "暂无版权",
            type: "warning",
            center: true,
          });
        });
    },
   
    //
    // isLikeSong() {
    //   let likeSongArr = [];
    //   this.songs.forEach((song) => {
    //     let likesong = this.createdSongList.forEach((item) => {
    //       return item.id == song.id;
    //     });
    //     likeSongArr.push(likesong);
    //   });
    //   console.log(likeSongArr);
    // },
     //点击喜欢按钮事件
    likeSong(song) {
      // console.log(song);
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
      getLikSongList(this.userInfo.userId).then((res) => {
        // console.log(res);
        this.likeSongIds = res.data.ids;
      });
      // 判断当前歌曲是否在用户喜欢列表
      let like = null;
      let index = this.likeSongIds.findIndex((item) => {
        return item == song.id;
      });
      if (index == -1) {
        like = true;
      } else {
        like = false;
      }
      console.log(like);
      // 网络请求 喜欢/不喜欢歌曲
      likeNowSong(song.id, like).then((res) => {
        // console.log(res);
        if ((like = true)) {
          this.$message({
            message: "已添加到我喜欢的音乐",
            type: "success",
            center: true,
          });
        }else{
          this.$message({
            message: "取消喜欢成功",
            type: "success",
            center: true,
          });
        }
      });
    },
    // 点击添加按钮
    addSong(song) {
      // 提交vuex添加到播放列表
      this.$store.dispatch("addPlayinglist", song);
      this.$message({
        message: "已添加到播放列表",
        type: "success",
        center: true,
      });
    },
    // 点击歌手 去往歌手页面
    toSinger(id) {
      this.$router.push("/singerdetail/" + id);
    },
    // 去往专辑页面
    toAlbum(id) {
      this.$router.push("/albumdetail/" + id);
    },
    // 去往MV页面
    toMvDetail(id) {
      this.$router.push({
        name: "VideoDetail",
        params: { id, type: "mv" },
      });
    },
    // 实现当前播放歌曲行高亮
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      if (row.id == this.nowSongDetail.id) {
        return "rowCurrent";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.icon-xihuan,
.el-icon-plus {
  padding-right: 15px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
  color: #999;
  &:hover {
    color: #409eff;
  }
}
.like {
  background: #409eff;
}
.icon-mv {
  font-size: 22px;
  color: #409eff;
  cursor: pointer;
  padding-left: 5px;
}
.icon-vip1 {
  color: red;
  font-size: 16px;
  font-weight: 400;
  padding-left: 5px;
}

.sthover:hover {
  display: inline-block;
  color: #409eff;
  width: 100%;
  cursor: pointer;
}
</style>
