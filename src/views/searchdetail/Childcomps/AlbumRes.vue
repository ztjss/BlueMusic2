<template>
  <div class="album-res">
    <div class="result">
      <h3>
        搜索<span style="color:#5292fe;">{{ this.keywords }}</span
        >,找到{{ albumRes.albumCount }}张专辑
      </h3>
    </div>
    <SingerAlbum :albumlist="albumRes.albums" />
    <!-- 分页器 -->
    <div
      class="page"
      v-if="albumRes.albumCount > 30 && albumRes.albums.length !== 0"
    >
      <el-pagination
        background
        @current-change="changAlbumPage"
        :page-size="30"
        layout="total, prev, pager, next"
        :total="albumRes.albumCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getSearchAlbum } from "network/searchdetail/searchdeatil";
/* 子组件 */
import Albumlist from "components/content/albumlist/Albumlist.vue";
import SingerAlbum from "../../singerdetail/Childcomps/SingerAlbum.vue";
export default {
  name: "AlbumRes",
  components: { Albumlist, SingerAlbum },
  data() {
    return {
      keywords: "", //关键词
      albumRes: {}, //专辑
    };
  },
  created() {
    // 保存搜索的关键词
    this.keywords = this.$route.params.keywords;
    this.getSearchAlbumBy(1);
  },
  methods: {
    /* 网络请求事件 */
    getSearchAlbumBy(page) {
      let offset = (page - 1) * 30;
      getSearchAlbum(this.keywords, offset).then((res) => {
        this.albumRes = res.data.result;
      });
    },

    // 专辑分页
    changAlbumPage(page) {
      this.getSearchAlbumBy(page);
      // 返回顶部
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
  },
};
</script>

<style lang="less" scoped>
.result {
  padding: 15px 10px;
}
</style>
