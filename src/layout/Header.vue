<template>
  <div id="header">
    <!-- 标题 -->
    <div class="title">
      <div class="icon">
        <img src="../assets/imgs/music-icon.png" alt="" />
      </div>
      <div class="text"><span>BlueMusic</span></div>
    </div>
    <!-- 操作 -->
    <div class="operation">
      <span class="iconfont icon-shangyiye" @click="goBack"></span>
      <span class="iconfont icon-xiayiye" @click="goForward"></span>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <Searchinput />
    </div>
    <!-- 右侧登录 -->
      <div class="right-login">
        <Login/>
      </div>

  </div>
</template>

<script>
import Searchinput from "components/common/Searchinput.vue";
import Login from "components/common/Login.vue"
export default {
  name: "Header",
  components: { Searchinput,Login },
 
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goForward() {
      this.$router.go(1);
    },
  },
};
</script>
<style lang="less" scoped>
#header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 60px;
  background: #5292fe;
  .title {
    // border: 1px solid red;
    flex: 2;
    display: flex;
    align-items: center;
    height: 60px;
    margin-left: 10px;
    .icon {
      width: 60px;
      height: 60px;
      img {
        height: 110%;
      }
    }
    .text {
      font-size: 22px;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 60px;
      padding-left: 10px;
    }
  }
  .operation {
    flex: 1;
    display: flex;
    justify-content: space-around;
    margin-left: 30px;
    color: #fff;
    span {
      display:block;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      background: rgba(100, 149, 237, 1);
      border-radius: 50%;
      cursor: pointer;
    }
  }
  .search {
    flex: 2;
  }
  .right-login{
    flex: 12;
  }
}
</style>
