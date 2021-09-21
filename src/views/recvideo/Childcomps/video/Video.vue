<template>
  <div class="video w ">
    <div class="logined" v-if="$store.state.isLogin">
      <!-- 标签导航 -->
      <TagsNav :all-tag="allTag" :hot-tag="hotTag" @tagClick="tagClick" />
      <!-- 视频列表 -->
      <div class="video-list"
      v-infinite-scroll="load" style="overflow:auto"
      >
        <VideoList :videolist="videoList" v-if="hasmore" />
        <div class="novideo" v-else>
          <el-empty
            description="暂无视频，请然后重试"
            :image-size="200"
          ></el-empty>
        </div>
      </div>
    </div>
    <div class="nologin" v-if="!$store.state.isLogin">
      <el-empty description="登录后才能查看" :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
/* 网络请求 */
import {
  geAllVideoTags,
  geHotVideoTags,
  getGroupVideoList,
} from "network/recvideo/recvideo";
/* 子组件 */
import TagsNav from "components/content/TagsNav.vue";
import VideoList from "components/content/videolist/VideoList.vue";
export default {
  name: "Video",
  components: { TagsNav, VideoList },
  data() {
    return {
      allTag: [],
      hotTag: [],
      videoList: [],
      // page: 0, //默认页数
      tagId: "", //标签id
      offset: 0,
      hasmore: true, //是否还有更多数据
      isloading:false
    };
  },
  created() {
    if (!this.$store.state.isLogin) {
      this.$message({
        type: "warning",
        message: "登录后才能查看",
        showClose: true,
        center: true,
      });
      return;
    }
    // 获取全部视频标签
    this.geAllVideoTagsBy();
    //获取热门视频标签
    this.geHotVideoTagsBy();
  },
  computed:{
    disabled () {
        return this.isloading
      }
  },
  methods: {
    /*
    网络请求事件
    */
    // 获取全部视频标签
    geAllVideoTagsBy() {
      geAllVideoTags().then((res) => {
        // console.log(res);
        this.allTag = res.data.data;
      });
    },
    //获取热门视频标签
    geHotVideoTagsBy() {
      geHotVideoTags().then((res) => {
        this.hotTag = res.data.data;
        this.tagId = this.hotTag[0].id;
        // 默认获取 现场 分类视频列表
        this.getGroupVideoListBy(this.tagId);
      });
    },
    //  获取分类视频列表
    getGroupVideoListBy(id) {
      // let offset=this.page;
      getGroupVideoList(id, this.offset).then((res) => {
        // console.log(res);
        this.hasmore = res.data.hasmore; //是否还有更多
          this.videoList.push(...res.data.datas);
          this.offset+=1;
      });
    },

    /*
    事件监听
    */
   //上拉加载更多
    load() {
      // this.isloading=false
      console.log("more");
      if (this.hasmore) {
        this.getGroupVideoListBy(this.tagId);
      } else this.$message.warning("没有更多了");
    },
    // 标签点击事件
    tagClick(tagName, id) {
      // this.isloading=true
      this.offset = 0;
      this.tagId = id; //保存标签id
      this.videoList = []; //清空视频列表
      this.getGroupVideoListBy(id);
    },
    
  },
};
</script>

<style lang="less" scoped>
.video-list {
  margin-top: 10px;
  height:calc(100vh - 200px);
  // border: 1px solid red;
}
::-webkit-scrollbar {
  width: 0px;
  height: 12px;
  background-color: #fff;
}
// .nologin {
//   width: 100%;
//   font-size: 22px;
//   font-weight: 700;
//   text-align: center;
// }
</style>
