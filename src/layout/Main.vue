<template>
  <div id="main">
    <!-- 侧边导航 -->
    <div class="aside">
      <Aside />
    </div>
    <!-- 主路由视图 -->
    <div class="view">
      <keep-alive
        exclude="Songlistdetail,VideoDetail,Singerdetail,Albumdetail,Searchdetail,UserDetail,Follows,FansList,PlayingSongDetail,MyFavorite"
      >
        <router-view v-if="isRouterAlive"></router-view>
      </keep-alive>
      <!-- 返回顶部按钮 -->
      <el-backtop
        target=".view"
        :right="10"
        :bottom="75"
        id="backtop"
      ></el-backtop>
    </div>
    <!-- 当前歌曲详情页 -->
    <transition name="songdetail">
      <PlayingSongDetail
        v-show="isShowSongDetail"
      />
    </transition>
  </div>
</template>

<script>
import Aside from "./Aside.vue";
import PlayingSongDetail from "components/content/player/PlayingSongDetail.vue";
import { mapGetters } from "vuex";
export default {
  name: "Main",
  components: { Aside, PlayingSongDetail },
  computed: {
    ...mapGetters(["nowSongDetail", "isShowSongDetail"]),
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  methods: {
    // 实现页面的局部刷新 使用provide提供 到需要刷新的页面进行引用，使用inject导入引用reload，然后直接调用即可
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style lang="less" scoped>
#main {
  height: calc(100% - 130px);
  display: flex;
}
.view {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
#backtop {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(100, 149, 237, .5);
}
// 歌曲详情页动画
.songdetail-enter,
.songdetail-leave-to {
  transform: translateY(calc(100vh - 70px));
}
.songdetail-enter-active,
.songdetail-leave-active {
  transition: all 0.5s;
}
.songdetail-enter-to {
  transform: translateY(0);
}
</style>
