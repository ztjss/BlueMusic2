<template>
  <div songlist-res>
    <div class="result">
      <h3>
        搜索<span style="color:#5292fe;">{{ this.keywords }}</span
        >,找到{{ songlistResCount }}个歌单
      </h3>
    </div>
    <SongList :songlist="songlistRes" />
    <!-- 分页器 -->
    <div class="page" v-if="songlistRes.length !== 0 && songlistResCount > 30">
      <el-pagination
        background
        @current-change="changSonglistPage"
        :page-size="30"
        layout="total, prev, pager, next"
        :total="songlistResCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getSearchSongList } from "network/searchdetail/searchdeatil";
import SongList from "components/content/songlist/SongList.vue";
export default {
  name: "SongListRes",
  components: { SongList },
  data() {
    return {
      keywords: "", //关键词
      songlistRes: [], //歌单
      songlistResCount: null,
    };
  },

  created() {
    // 保存搜索的关键词
    this.keywords = this.$route.params.keywords;
    this.getSearchSongListBy(1);
  },

  methods: {
    getSearchSongListBy(page) {
      let offset = (page - 1) * 30;
      getSearchSongList(this.keywords, offset).then((res) => {
        // console.log(res);
        this.songlistRes = res.data.result.playlists;
        this.songlistResCount = res.data.result.playlistCount;
      });
    },

    changSonglistPage(page) {
      this.getSearchSongListBy(page);
      // 返回顶部
      let backtop = document.querySelector("#backtop");
      backtop.click();
    },
  },
};
</script>

<style lang="less" scoped>
.result {
  padding: 10px 0px 15px;
}
</style>
