<template>
	<div class="float-lyric" :class="{ bg: isShowBg }" ref="lyric" @mousedown="dragLyric" @mouseover="showBg" @mouseleave="closeBg">
		<div class="lyric">
			<!-- 关闭按钮 -->
			<div class="close" v-show="isShowBg">
				<span class="iconfont icon-guanbi1" @click="closeFloatLyric"></span>
			</div>
			<!-- 没有歌词时 -->
			<div style="font-size: 18px; line-height: 60px; color: #409eff" v-if="currentLyric.length == 0">暂无歌词</div>
			<!-- 有歌词时 -->
			<div id="scrollLyric" ref="scrollLyric" v-else>
				<ul>
					<li v-for="(item, index) in currentLyric" :key="index" :class="{ currentActive: currentRow == index }">
						{{ item.text }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
/* vuex */
import { mapGetters } from "vuex";
export default {
	name: "Floatlyric",
	data() {
		return {
			currentRow: "", //当前播放的歌词行数
			isShowBg: true,
		};
	},
	computed: {
		...mapGetters(["currentLyric", "currentSecond"]),
	},
	methods: {
		//   关闭悬浮歌词
		closeFloatLyric() {
			this.$store.commit("showFloatLyric");
		},
		// 拖动悬浮歌词
		dragLyric(e) {
			// 先获取鼠标在盒子内的坐标
			// 鼠标按下，要得到一开始鼠标在盒子的坐标。
			let x = e.pageX - this.$refs.lyric.offsetLeft;
			let y = e.pageY - this.$refs.lyric.offsetTop;
			let lyric = this.$refs.lyric;
			// 鼠标移动只有鼠标按下才能触发  移动事件写到按下事件里面
			document.addEventListener("mousemove", move);
			function move(e) {
				// 鼠标移动，就让歌词框的坐标 设置为 :鼠标一开始坐标 减去鼠标在盒子坐标即可
				lyric.style.left = e.pageX - x + "px";
				lyric.style.top = e.pageY - y + "px";
			}
			// 鼠标松开，就停止拖拽，让鼠标移动事件解除
			document.addEventListener("mouseup", function () {
				document.removeEventListener("mousemove", move);
			});
		},
		// 是否显示背景色
		showBg() {
			this.isShowBg = true;
		},
		closeBg() {
			this.isShowBg = false;
		},
	},
	watch: {
		// 监听当前时间的变化 通过修改position的top值实现滚动
		currentSecond() {
			this.currentLyric.forEach((item, index) => {
				if (Math.ceil(this.currentSecond) >= item.time) {
					this.$refs.scrollLyric.style.top = -index * 60 + "px";
					this.currentRow = index; //用于判断当前歌词高亮显示
				}
			});
		},
	},
};
</script>

<style lang="less" scoped>
.float-lyric {
	position: absolute;
	left: 50%;
	top: 82%;
	transform: translateX(-50%);
	cursor: move;
	z-index: 9999;
}
.bg {
	background: rgba(100, 100, 100, 0.3);
}
.lyric {
	position: relative;
	width: 500px;
	height: 60px;
	text-align: center;
	color: #eee;
	overflow-y: hidden;
	#scrollLyric {
		position: absolute;
		top: 0px;
		width: 100%;
		li {
			height: 60px;
			line-height: 60px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.currentActive {
			font-size: 22px;
			color: #409eff;
			font-weight: 700;
		}
	}
}
.close {
	position: absolute;
	right: 5px;
	top: 5px;
	z-index: 99999;
	cursor: pointer;
}
</style>
