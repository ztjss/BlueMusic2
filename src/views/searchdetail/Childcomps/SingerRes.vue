<template>
	<div class="singer-res">
		<div class="result">
			<h3>
				搜索<span style="color: #5292fe">{{ this.keywords }}</span
				>,找到{{ singerResCount }}位歌手
			</h3>
		</div>
		<div class="singerRes">
			<Singerlist :singerlist="singerRes" />
		</div>
		<!-- 分页器 -->
		<div class="page" v-if="singerRes.length !== 0 && singerResCount > 30">
			<el-pagination background @current-change="changSingerPage" :page-size="30" layout="total, prev, pager, next" :total="singerResCount"> </el-pagination>
		</div>
	</div>
</template>

<script>
import { getSearchSinger } from "network/searchdetail/searchdeatil";
import Singerlist from "components/content/singerlist/Singerlist.vue";
export default {
	name: "SingerRes",
	components: { Singerlist },
	data() {
		return {
			keywords: "", //关键词
			singerRes: [], //歌手
			singerResCount: null,
		};
	},

	created() {
		// 保存搜索的关键词
		this.keywords = this.$route.params.keywords;
		this.getSearchSingerBy(1);
	},

	methods: {
		getSearchSingerBy(page) {
			let offset = (page - 1) * 30;
			getSearchSinger(this.keywords, offset).then(res => {
				// console.log(res);
				this.singerRes = res.data.result.artists;
				this.singerResCount = res.data.result.artistCount;
			});
		},

		changSingerPage(page) {
			this.getSearchSingerBy(page);
			// 返回顶部
			let backtop = document.querySelector("#backtop");
			backtop.click();
		},
	},
};
</script>

<style lang="less" scoped>
.result {
	padding: 10px 0px 15px;
}
</style>
