<template>
  <div class="favorite-album w">
    <el-divider content-position="left"><h2>我收藏的专辑({{albumcount}})</h2></el-divider>
    <Albumlist :albumlist="favoriteAlbum" v-if="favoriteAlbum.length!==0"/>
    <div v-if="favoriteAlbum.length==0">
        <el-empty description="还没有收藏的专辑" :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
import { getSubAlbum } from "network/myfavorite/myfavorite";
import Albumlist from "components/content/albumlist/Albumlist.vue";
import {mapGetters} from "vuex"
export default {
  name: "FavoriteAlbum",
  components: { Albumlist },
  computed:{
      ...mapGetters(["subAlbumlist"])
  },
  data() {
    return {
        favoriteAlbum:[],
        albumcount:0
    };
  },
  methods: {
    getSubAlbumBy() {
      // 定义一个时间戳 每次获得最新的数据
      let timestamp = Date.parse(new Date());
      getSubAlbum(timestamp).then((res) => {
          this.favoriteAlbum=res.data.data;
          this.albumcount=res.data.count;
        //   console.log(this.favoritealbum);
        this.$store.dispatch('saveFavoriteAlbum', res.data.data);
      });
    },
  },
  created(){
      if(this.subAlbumlist.length==0){
          this.getSubAlbumBy();
      }else{
          this.favoriteAlbum=this.subAlbumlist;
          this.albumcount=this.subAlbumlist.length;
      }
  },
  // watch: {
  //   subAlbumlist(current) {
  //     this.favoriteAlbum= current;
  //     this.albumcount=current.length;
  //   },
  // },

};
</script>

<style lang="less" scoped>
</style>
