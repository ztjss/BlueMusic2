<template>
  <div class="comment">
    <!-- 输入框 -->
    <div class="textinput">
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="content"
        rows="3"
        maxlength="100"
        show-word-limit
      >
      </el-input>
      <el-button
        round
        type="primary"
        size="small"
        icon="el-icon-position"
        class="el-btn"
        @click="submitComment"
        >发送评论</el-button
      >
    </div>
    <!-- 评论列表 -->
    <div class="comment-list" ref="commentlist">
      <!-- 热门评论 -->
      <div class="hot-comment" v-if="hotcomments.length !== 0">
        <h3>热门评论</h3>
        <CommentItem
          v-for="(item, index) in hotcomments"
          :key="index"
          :item="item"
          @toUserDetail="toUserDetail"
        />
      </div>
      <!-- 最新评论 -->
      <div class="new-comment" v-if="isReload">
        <h3>最新评论</h3>
        <CommentItem
          v-for="(item, index) in comments"
          :key="index"
          :item="item"
          @toUserDetail="toUserDetail"
        />
      </div>
      <!-- 分页器 -->
      <div
        class="page"
        v-if="hotcomments.length !== 0 || comments.length !== 0"
      >
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="hotcomments.length + 20"
          layout="total,prev, pager, next"
          :total="commentCount"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
/* 网络请求 */
import { submitCommentBy } from "network/comment/comment";
/* 子组件 */
import CommentItem from "./CommentItem.vue";
export default {
  name: "CommentPage",
  components: { CommentItem },
  props: {
    // 最新评论数据
    comments: {
      type: Array,
      default() {
        return [];
      },
    },
    //热门评论数据
    hotcomments: {
      type: Array,
      default() {
        return [];
      },
    },
    // 评论总数量
    commentCount: {
      type: Number,
    },
    // 发表评论的类型
    // 0:歌曲 1:mv 2:歌单 3:专辑 5:视频
    commentType: {
      type: Number,
    },
    // id:评论的资源id
    commentresId: {
      type: null,
    },
  },

  data() {
    return {
      isReload: true,
      content: "", //评论区文本框
      currentPage: 1, //分页器默认页数
      timer: "",
    };
  },
  methods: {
    /* 发表评论 */
    submitComment() {
      // 先判断登录状态
      if (!this.$store.state.isLogin) {
        this.$message({
          type: "warning",
          message: "登录后才能评论",
          showClose: true,
          center: true,
        });
        return;
      }
      // 判断评论是否为空
      if (this.content == "") {
        this.$message({
          type: "warning",
          message: "评论不能为空",
          showClose: true,
          center: true,
        });
        return;
      } else {
        // 发表评论
        submitCommentBy(this.commentType, this.commentresId, this.content).then(
          (res) => {
            console.log(res);
            if (res.data.code == 200) {
              // 发送成功则 清空文本框 再从新请求评论数据
              this.content = "";
              this.$message({
                type: "success",
                message: "评论成功",
                center: true,
              });
              // this.$router.go(0);
              this.reload();
            } else this.$message.error("评论失败,请稍后重试!");
          }
        );
      }
    },
    // 刷新评论
    reload() {
      this.isReload = false;
      this.$emit("updateComment");
      this.$nextTick(function() {
        this.isReload = true;
      });
    },
    /* 评论列表分页 */
    handleCurrentChange(page) {
      // 当前页码改变时触发（参数是当前页码）
      this.currentPage = page;
      this.$emit("changePage", page);
    },
    // 点击用户头像
    toUserDetail() {
      // 如果在歌曲详情页点击 需要关闭歌曲详情页
      this.$emit("toUserDetail");
    },
  },
  updated() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
.comment {
  position: relative;
}
.textinput {
  text-align: right;
  .el-btn {
    margin-top: 10px;
  }
}
h3 {
  color: black;
}
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
          color: royalblue;
        }
      }
      .be-replied {
        margin: 15px 0;
        padding: 20px 10px;
        background: #eee;
        span {
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
.new-comment {
  margin-top: 20px;
}
</style>
