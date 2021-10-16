<template>
  <div id="song-rank" class="w" v-if="allRankInfo.length!==0">
    <Rankfeature :rankfeature="rankfeature" />
    <Rankglobal :rankglobal="rankglobal" />
  </div>
</template>

<script>
/* 网络请求 */
import { getAllRankInfo } from "network/findmusic/songrank/songrank";
/* 子组件 */
import Rankfeature from "./Childcomps/Rankfeature";
import Rankglobal from "./Childcomps/Rankglobal";
export default {
  name: "Songrank",
  components: { Rankfeature ,Rankglobal},
  data() {
      return {
          allRankInfo:[],
          rankfeature:[],
          rankglobal:[]
      };
  },
  created(){
      getAllRankInfo().then(res=>{
          // console.log(res);
        this.allRankInfo=res.data.list;
        // 处理榜单数据 分为两个数组
        this.rankfeature=this.allRankInfo.slice(0,4)
        this.rankglobal=this.allRankInfo.slice(4,this.allRankInfo.length)
      })
  }
};
</script>

<style lang="less" scoped></style>
