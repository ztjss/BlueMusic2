<template>
	<div class="search-input">
		<!-- 输入框 -->
		<el-input placeholder="请输入内容" size="small" v-model="searchWord" v-popover:popover slot="reference" @keyup.enter.native="search">
			<span slot="suffix" class="el-icon-search" @click="search"></span>
		</el-input>
		<!-- 热搜弹出框 -->
		<div>
			<el-popover ref="popover" placement="bottom" width="350" trigger="focus">
				<div class="hot-search-rank hot-search-pop">
					<h2>热搜榜</h2>
					<ul>
						<li v-for="(item, index) in searchList" :key="index" @click="addHotWord(item.searchWord)">
							<div class="num" :class="index < 3 ? 'hotword-num' : ''">
								{{ index + 1 }}
							</div>
							<div class="main-content">
								<div class="word">
									<span :class="index < 3 ? 'hotword' : ''">
										{{ item.searchWord }}
									</span>
									<span class="by">{{ item.score }}</span>
									<span class="icon" v-if="item.iconUrl">
										<img :src="item.iconUrl" alt="" />
									</span>
								</div>
								<p class="by">{{ item.content }}</p>
							</div>
						</li>
					</ul>
				</div>
			</el-popover>
		</div>
	</div>
</template>

<script>
import { getSearchHotWord } from "network/searchdetail/searchdeatil";
export default {
	name: "Searchinput",
	data() {
		return {
			searchWord: "",
			searchList: [],
		};
	},
	created() {
		getSearchHotWord().then(res => {
			// console.log(res);
			this.searchList = res.data.data;
		});
	},
	methods: {
		// 搜索事件
		search() {
			if (this.searchWord == "") {
				this.$message({
					showClose: true,
					message: "请输入内容",
					type: "warning",
					center: true,
				});
			} else {
				this.$router.push("/searchdetail/" + this.searchWord).catch(err => err);
				this.$refs.popover.doClose(); //关闭弹框
			}
		},
		// 热搜榜添加
		addHotWord(word) {
			this.$refs.popover.doClose(); //关闭弹框
			this.searchWord = word;
			this.$router.push("/searchdetail/" + this.searchWord).catch(err => err);
		},
	},
};
</script>

<style lang="less" scoped>
.search-input {
	position: relative;
	display: flex;
	align-items: center;
	.el-icon-search {
		cursor: pointer;
		padding-top: 10px;
		&:hover {
			color: royalblue;
			font-weight: 700;
		}
	}
}
.hot-search-rank {
	width: 350px;
	height: 450px;
	overflow-y: scroll;
	cursor: pointer;
	background: #fff;
	h2 {
		padding: 6px;
	}
	li {
		display: flex;
		align-items: center;
		padding: 10px 5px;
		.num {
			width: 30px;
			padding-left: 5px;
		}
		.hotword-num {
			color: red;
			font-weight: 700;
		}
		.main-content {
			.word {
				span {
					padding-right: 10px;
				}
				.icon {
					display: inline-block;
					width: 30px;
					height: 20px;
					img {
						width: 100%;
					}
				}
			}
			p {
				padding-top: 5px;
			}
			.hotword {
				color: black;
				font-weight: 700;
			}
		}
	}
	li:hover {
		background: rgba(220, 220, 220, 0.4);
	}
}
</style>
