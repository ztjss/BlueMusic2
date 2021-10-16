<template>
  <div class="mv w">
    <!-- 顶部分类标签 -->
    <div class="tags" ref="tagsnav">
      <TagsBar :taglist="areaList" @tagBarClick="areaClick" />
      <TagsBar :taglist="typeList" @tagBarClick="typeClick" />
      <TagsBar :taglist="orderList" @tagBarClick="orderClick" />
    </div>
    <!-- MV列表 -->
    <div class="mv-list">
      <VideoList :videolist="mvList" />
    </div>
    <!-- 分页器 -->
    <div class="page" v-if="mvList.length != 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="40"
        layout="total,prev, pager, next"
        :total="mvCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
/* 网络请求 */
import { getAllMv } from "network/recvideo/recvideo";
/* 子组件 */
import VideoList from "components/content/videolist/VideoList.vue";
import TagsBar from "components/content/TagsBar.vue";
export default {
  components: { VideoList, TagsBar },
  name: "Mv",
  data() {
    return {
      areaList: {
        category: "地区",
        list: ["全部", "内地", "港台", "欧美", "日本", "韩国"],
      },
      typeList: {
        category: "类型",
        list: ["全部", "官方版", "原生", "现场版", "网易出品"],
      },
      orderList: {
        category: "排序",
        list: ["上升最快", "最热", "最新"],
      },
      mvList: [], //MV列表
      mvCount: 5000,
      currentPage: 1,
      area: "全部",
      type: "全部",
      order: "上升最快",
      limit: 40,
      page: 1,
    };
  },
  created() {
    //   默认请求数据
    this.getAllMvBy("全部", "全部", "上升最快", 1);
  },
  methods: {
    /* 网络请求事件 */
    getAllMvBy(area, type, order, page) {
      let offset = (page - 1) * this.limit;
      getAllMv(area, type, order, offset, this.limit).then((res) => {
        // console.log(res.data);
        this.mvCount=res.data.count;
        this.mvList = res.data.data;
      });
    },
    /* 标签点击事件 */
    areaClick(item) {
      this.currentPage = 1;
      this.area = item;
      this.getAllMvBy(item, this.type, this.order, this.page);
    },
    typeClick(item) {
      this.currentPage = 1;
      this.type = item;
      this.getAllMvBy(this.area, item, this.order, this.page);
    },
    orderClick(item) {
      this.currentPage = 1;
      this.order = item;
      this.getAllMvBy(this.area, this.type, item, this.page);
    },

    /* 分页事件 */
    handleCurrentChange(page) {
      // 当前页码改变时触发（参数是当前页码）
      this.currentPage = page;
      this.getAllMvBy(this.area, this.type, this.order, page);
      // 滚动返回指定位置
      let view = document.querySelector(".view");
      view.scrollTo({
        top: this.$refs.tagsnav.offsetTop
      });
    },
  },
};
</script>

<style lang="less" scoped>
.mv{
  position: relative;
}
.mv-list {
  padding-top: 30px;
}
</style>
