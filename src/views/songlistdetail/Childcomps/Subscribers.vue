<template>
  <div class="subscribers ">
    <UserList :userlist="subscribers" v-if="subscribers.length !== 0" />
    <!-- 分页器 -->
    <div class="page" v-if="subscribers.length !== 0 && totalcount > 48">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="48"
        layout="total, prev, pager, next"
        :total="totalcount"
      >
      </el-pagination>
    </div>
    <div class="no" v-if="subscribers.length== 0">
      暂无收藏者
    </div>
  </div>
</template>

<script>
import UserList from "components/content/userlist/UserList.vue";
export default {
  name: "Subscribers",
  components: { UserList },
  props: {
    subscribers: {
      type: Array,
      default() {
        return [];
      },
      
    },
    totalcount:{
        type:Number
      }
  },
  methods: {
    toUserDetail(uid) {
      this.$router.push("/userdetail/" + uid);
    },
    handleCurrentChange(page){
      this.$emit("handlePage", page);
    }
  },
};
</script>

<style lang="less" scoped>
.no{
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 24px;
}
</style>
