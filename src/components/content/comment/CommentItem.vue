<template>
  <!-- 每一条评论 -->
  <div class="coment-item">
    <div class="base-info">
      <!-- 头像 -->
      <div class="avatar" @click="toUserDetail(item.user.userId)">
        <img :src="item.user.avatarUrl" alt="" />
      </div>
      <!-- 右侧内容 -->
      <div class="right-info">
        <!-- 评论 -->
        <div class="content">
          <p>
            <span @click="toUserDetail(item.user.userId)"
              >{{ item.user.nickname }}:</span
            >{{ item.content }}
          </p>
        </div>
        <!-- 回复的评论 -->
        <div class="be-replied" v-if="item.beReplied.length !== 0">
          <div v-for="(item2, index2) in item.beReplied" :key="index2">
            <p>
              <span @click="toUserDetail(item.user.userId)"
                >{{ item2.user.nickname }}:</span
              >{{ item2.content }}
            </p>
          </div>
        </div>
        <!-- 评论时间 -->
        <div class="coment-time">
          <p>{{ item.time | showDate }}</p>
        </div>
      </div>
    </div>
    <!-- 点赞评论 -->
    <div class="like">
      <span class="iconfont icon-dianzan">{{ item.likedCount }}</span>
      <span class="iconfont icon-comment"></span>
    </div>
  </div>
</template>

<script>
import { formatDate } from "common/formatDate";
export default {
  name: "CommentItem",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  /* 格式化日期 */
  filters: {
    showDate(value) {
      const date = new Date(value);
      return formatDate(date, "yyyy-MM-dd   hh:mm:ss");
    },
  },
  methods: {
    // 点击用户头像
    toUserDetail(uid) {
      this.$router.push("/userdetail/" + uid);
      // 如果在歌曲详情页点击 需要关闭歌曲详情页
      this.$emit("toUserDetail");
    },
  },
};
</script>

<style lang="less" scoped>
.coment-item {
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  .base-info {
    display: flex;
    justify-content: left;
    .avatar {
      width: 6%;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }
    .right-info {
      width: 94%;
      padding-left: 15px;
      .content {
        padding-top: 10px;
        span {
          cursor: pointer;
          color: royalblue;
        }
      }
      .be-replied {
        margin: 15px 0;
        padding: 20px 10px;
        background: #eee;
        span {
          cursor: pointer;
          color: royalblue;
        }
      }
      .coment-time {
        padding-top: 10px;
      }
    }
  }
  .like {
    text-align: right;
    padding-right: 20px;
    span {
      padding-right: 15px;
    }
  }
}
</style>
