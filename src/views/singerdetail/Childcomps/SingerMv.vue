<template>
	<div class="singer-mv">
		<div class="mv-list">
			<VideoList :videolist="mvlist" />
		</div>
		<!-- 分页器 -->
		<div class="page" v-if="mvlist.length !== 0 && mvsize > 40">
			<el-pagination background @current-change="handleCurrentChange" :page-size="40" layout="total, prev, pager, next" :total="mvsize"> </el-pagination>
		</div>
	</div>
</template>

<script>
import VideoList from "components/content/videolist/VideoList.vue";
export default {
	name: "SingerMv",
	components: { VideoList },
	props: {
		mvlist: {
			type: Array,
			default() {
				return [];
			},
		},
		mvsize: Number,
	},
	methods: {
		/* 分页事件 */
		handleCurrentChange(page) {
			// 当前页码改变时触发（参数是当前页码）
			this.$emit("changeMvPage", page);
			// 返回顶部
			let backtop = document.querySelector("#backtop");
			backtop.click();
		},
	},
};
</script>

<style lang="less" scoped>
.mv-list {
	padding-top: 10px;
}
</style>
