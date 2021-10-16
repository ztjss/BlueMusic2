<template>
  <div class="login-pop">
    <!-- 关闭按钮 -->
    <div class="close" @click="closeLogin">
      <span class="iconfont icon-guanbi1"></span>
    </div>
    <!-- 手机号登录 -->
    <div class="phone-login" v-if="loginWay == 0">
      <!-- logo -->
      <div class="imgs">
        <img src="~assets/imgs/music-icon.png" alt="" />
      </div>
      <!-- 表单 -->
      <div class="form">
        <el-form label-position="right" label-width="70px">
          <el-form-item label="手机号">
            <el-input
              type="tlephone"
              v-model="PhoneNum"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              type="password"
              v-model="Password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="plogin-btn">
            <el-button type="primary" @click="phoneLogin">登录</el-button>
            <el-button>注册</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="other-way" @click="changeLoginWay(1)" style="margin-top:40px">
        <span
          ><i class="iconfont icon-erweima1"></i> <i class="text">扫码登录</i>
        </span>
      </div>
    </div>

    <!-- 扫码登录 -->
    <div class="qr-login" v-else>
      <div class="qr">
        <h1>扫码登录</h1>
        <img :src="qrurl" alt="" />
        <p class="failqr" v-if="failqr">
          二维码已失效，<span @click="qrLogin">点击刷新</span>
        </p>
        <p class="text">
          使用<span style="color:#5292fe;">网易云音乐APP</span>扫码登录
        </p>
        <!-- 其他登录方式 -->
        <div
          class="other-way"
          @click="changeLoginWay(0)"
          style="margin-top: 90px;"
        >
          <span>
            <i class="iconfont icon-tel"></i>
            <i class="text"> 手机号登录</i></span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  login,
  getQrKey,
  getLoginQr,
  checkLoginQr,
  getUserAccount,
} from "network/login/login";
import { getUserSonglist, getUserDetail } from "network/userdetail/userdetail";
import {getLikSongList} from "network/playmusic/playmusic.js";
export default {
  name: "LoginPop",
  data() {
    return {
      PhoneNum: "",
      Password: "",
      loginWay: 1,
      qrurl: "",
      timer: "",
      failqr: false,
    };
  },
  created() {
    this.qrLogin();
  },
  methods: {
    // 关闭登录框
    closeLogin() {
      this.$emit("closeLogin");
      clearInterval(this.timer);
    },
    // 切换登录方式
    changeLoginWay(way) {
      this.loginWay = way;
      // 如果是手机号登录就清除二维码登录的定时器
      if (way === 0) {
        clearInterval(this.timer);
      }
      // 二维码登录
      if (way === 1) {
        this.qrLogin();
      }
    },

    // 二维码登录
    async qrLogin() {
      this.failqr = false; // 用于隐藏二维码失效后的文本提示
      let timestamp = Date.parse(new Date());
      // 获取二维码key
      let res = await getQrKey(timestamp);
      let key = res.data.data.unikey;
      // 生成二维码
      let timestamp2 = Date.parse(new Date());
      let res2 = await getLoginQr(key, timestamp2);
      this.qrurl = res2.data.data.qrimg;
      // 检查二维码状态（利用定时器不断轮询）
      this.timer = setInterval(async () => {
        let timestamp3 = Date.parse(new Date());
        let statusRes = await checkLoginQr(key, timestamp3);
        if (statusRes.data.code === 800) {
          this.$message({
            showClose: true,
            message: "二维码已失效",
            type: "error",
            center: true,
          });
          clearInterval(this.timer);
          // 用于显示二维码失效后的文本提示，
          this.failqr = true;
        }
        if (statusRes.data.code === 803) {
          clearInterval(this.timer);
          this.$message({
            showClose: true,
            message: "登录成功",
            type: "success",
            center: true,
          });
          // 获取用户账户信息
          this.getUserLoginAccount();
        }
      }, 2000);
    },
    // 二维码登录 获取用户登录后的账户信息
    getUserLoginAccount() {
      let timestamp = Date.parse(new Date());
      getUserAccount(timestamp).then((res1) => {
        let uid = res1.data.account.id;
        // 获取用户个人信息
        getUserDetail(uid, timestamp).then((res) => {
          this.loginSuccess(res);
        });
      });
    },

    // 手机号登录事件
    phoneLogin() {
      if (this.PhoneNum.trim() === "" || this.Password === "") {
        this.$message({
          message: "手机号或密码不能为空",
          type: "warning",
          center: true,
        });
        return;
      } else {
        login(this.PhoneNum, this.Password).then((res) => {
          if (res.data.code != 200) {
            this.$message({
              message: "手机号或密码错误",
              type: "warning",
              center: true,
            });
          } else {
            this.$message({
              showClose: true,
              message: "登录成功",
              type: "success",
              center: true,
            });
            // 登录成功后的一些操作
            this.loginSuccess(res);
          }
        });
      }
    },

    // 登录成功后的一些操作
    loginSuccess(res) {
      // 关闭登录框
      this.closeLogin();
      // 更新登录状态
      this.$store.dispatch("updateLogin", true);
      localStorage.setItem("isLogin", true);
      //缓存用户信息 防止刷新消失
      localStorage.setItem("userInfo", JSON.stringify(res.data.profile));
      // 提交vuex 保存用户信息
      this.$store.dispatch("saveUserInfo", res.data.profile);
      // 获取用户歌单数据
      this.getUserSonglistBy(res.data.profile.userId);
      
    },
    // 获取用户歌单和喜欢的音乐数据
    getUserSonglistBy(uid) {
      let timestamp = Date.parse(new Date());
      getUserSonglist(uid, timestamp).then((res) => {
        // console.log(res);
        localStorage.setItem("userSongList", JSON.stringify(res.data.playlist));
        this.$store.dispatch("saveUserSongList", res.data.playlist);
      });
      getLikSongList(uid).then((res) => {
        this.$store.dispatch("saveLikeSongIds", res.data.ids);
      });
    },
    
  },
};
</script>

<style lang="less" scoped>
.login-pop {
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  box-shadow: 0px 0px 5px 5px #eef;
  background: #dcdcdc;
  border-radius: 10px;
  width: 350px;
  height: 480px;
  background: #fff;
  text-align: center;
  .close {
    text-align: right;
    cursor: pointer;
    padding: 10px 20px 0 0;
    .iconfont {
      font-size: 22px;
    }
  }
}
.phone-login {
  .imgs {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    img {
      width: 100%;
    }
    padding-bottom: 20px;
  }
  .form {
    padding-right: 30px;
  }
}
.qr-login {
  .qr {
    width: 100%;
    margin-bottom: 50px;
    img {
      width: 220px;
      height: 220px;
    }
    .failqr {
      margin-bottom: 5px;
      span {
        color: #5292fe;
        cursor: pointer;
      }
    }
  }
}
.other-way {
  span:hover {
    color: #5292fe;
    cursor: pointer;
  }
}
</style>
