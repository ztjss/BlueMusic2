<template>
  <div class="record w">
    <h2> <span  class="iconfont icon-paixingbang"></span>听歌排行</h2>
    <div class="date-category">
      <span
        v-for="(item, index) in dateCategory"
        :key="index"
        @click="changeRecoed(item.type)"
        :class="{ active: currentIndex === index }"
        >{{ item.title }}</span
      >
    </div>
    <SongTable :songs="recordData" v-if="recordData.length!=0" />
     <div  v-else>
      <el-empty description="暂无记录" :image-size="200"></el-empty>
    </div>
  </div>
</template>

<script>
import { getUserRecord } from "network/userdetail/userdetail";
import SongTable from "components/content/SongTable.vue";
export default {
  name: "Record",
  components: { SongTable },
  data() {
    return {
      uid: "",
      dateCategory: [
        { title: "所有时间", type: 0 },
        { title: "最近一周", type: 1 },
      ],
      recordData: [],
      currentIndex: 0,
    };
  },
  created() {
    this.uid = this.$route.params.uid;
    this.getUserRecordBy(this.uid);
  },
  methods: {
    //   获取播放记录
    getUserRecordBy(uid, type = 0) {
      getUserRecord(uid, type).then((res) => {
        // console.log(res);
        this.recordData = [];
        if (type === 0) {
          res.data.allData.forEach((item) => {
            this.recordData.push(item.song);
          });
        } else if (type === 1) {
          res.data.weekData.forEach((item) => {
            this.recordData.push(item.song);
          });
        }
      }).catch(err=>err)
    },
    // 切换记录
    changeRecoed(type) {
      this.getUserRecordBy(this.uid, type);
      this.currentIndex = type;
    },
  },
};
</script>

<style lang="less" scoped>
.iconfont{
  font-size: 36px;
  padding-right: 10px;
}
.date-category {
  margin: 20px 0;
  span {
    padding-right: 10px;
    cursor: pointer;
  }
}
.active {
  font-weight: 700;
}
</style>
