<template>
	<div class="video w">
		<div class="logined" v-if="$store.state.isLogin">
			<!-- 标签导航 -->
			<TagsNav :all-tag="allTag" :hot-tag="hotTag" @tagClick="tagClick" />
			<!-- 视频列表 -->
			<div class="video-list" v-if="hasmore">
				<VideoList :videolist="videoList" />
				<div class="page" v-if="videoList.length != 0 && hasmore">
					<span @click="handleCurrentChange" class="more">点击加载更多</span>
				</div>
			</div>
			<div class="novideo" v-else>
				<el-empty description="暂无视频" :image-size="200"></el-empty>
			</div>
		</div>
		<div class="nologin" v-if="!$store.state.isLogin">
			<el-empty description="登录后才能查看" :image-size="200"></el-empty>
		</div>
	</div>
</template>

<script>
/* 网络请求 */
import { geAllVideoTags, geHotVideoTags, getGroupVideoList } from "network/recvideo/recvideo";
/* 子组件 */
import TagsNav from "components/content/TagsNav.vue";
import VideoList from "components/content/videolist/VideoList.vue";
export default {
	name: "Video",
	components: { TagsNav, VideoList },
	data() {
		return {
			allTag: [],
			hotTag: [],
			videoList: [{}],
			tagId: "", //标签id
			page: 1,
			hasmore: false, //是否还有更多数据
		};
	},
	created() {
		if (!this.$store.state.isLogin) {
			this.$message({
				type: "warning",
				message: "登录后才能查看",
				showClose: true,
				center: true,
			});
			return;
		}
		// 获取全部视频标签
		this.geAllVideoTagsBy();
		//获取热门视频标签
		this.geHotVideoTagsBy();
	},
	methods: {
		/*
    网络请求事件
    */
		// 获取全部视频标签
		geAllVideoTagsBy() {
			geAllVideoTags().then(res => {
				this.allTag = res.data.data;
			});
		},
		//获取热门视频标签
		geHotVideoTagsBy() {
			geHotVideoTags().then(res => {
				this.hotTag = res.data.data;
				this.tagId = this.hotTag[0].id;
				// 默认获取 现场 分类视频列表
				this.getGroupVideoListBy(this.tagId);
			});
		},
		//  获取分类视频列表
		getGroupVideoListBy(id) {
			let offset = this.page - 1;
			getGroupVideoList(id, offset).then(res => {
				console.log(this.page);
				this.hasmore = res.data.hasmore; //是否还有更多
				this.videoList.push(...res.data.datas);
				this.page += 1;
			});
		},

		/*
    事件监听
    */
		// 点击加载更多
		handleCurrentChange() {
			this.getGroupVideoListBy(this.tagId);
		},
		// 标签点击事件
		tagClick(tagName, id) {
			this.page = 1;
			this.videoList = []; //清空视频列表
			this.tagId = id; //保存标签id
			this.getGroupVideoListBy(id);
		},
	},
};
</script>

<style lang="less" scoped>
.video-list {
	margin-top: 30px;
}
.more {
	color: #5292fe;
	cursor: pointer;
}
</style>
