<template>
	<div class="progress">
		<div ref="progressBox" class="progressBox" @mousemove="setTooltip" @mouseleave="mouseLeave" @click="changeProgressBar">
			<div class="progress-bar" ref="progressBar"></div>
			<div class="tooltip" ref="tooltip" v-show="isShowToolTip">
				<span>{{ formatTooltip.isFormatTooltip ? formatTooltip.tooltipTxt : length }}</span>
				<div class="sanjiao"></div>
			</div>
			<div class="hoverBar" ref="hoverBar"></div>
		</div>
		<transition name="el-fade-in-linear">
			<div class="radiusBtn" ref="radiusBtn" v-show="isMouseover" @mouseover="isMouseover = true" @mouseleave="isMouseover = false" @mousedown="dragProgressBar"></div>
		</transition>
	</div>
</template>

<script>
export default {
	name: "Progress",
	props: {
		percent: {
			type: Number,
			default: 0,
			require: true,
		},
		formatTooltip: {
			type: Object,
			default() {
				return {
					isFormatTooltip: false,
					tooltipTxt: "",
				};
			},
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			progressBoxWidth: 0, //进度条总宽度
			progressBoxLeft: "", //进度条距左边距离
			length: 0, //进度条百分比数值
			isMouseover: false, //鼠标是否经过进度条
			isShowToolTip: false, //是否显示tooltip
			isDrag: false, //是否正在拖拽
		};
	},
	mounted() {
		this.progressBoxWidth = this.$refs.progressBox.getBoundingClientRect().width; //进度条总宽度
		this.progressBoxLeft = this.$refs.progressBox.getBoundingClientRect().left; //进度条距左边距离
		this.setProgressBar(this.percent);
		this.setHoverBar();
	},
	methods: {
		// 获取鼠标在进度条上的位置，返回一个百分比值
		getMousePositon(e) {
			let mousePositon = e.clientX - this.progressBoxLeft;
			mousePositon = mousePositon <= 0 ? 0 : mousePositon; //设置最小边界值
			mousePositon = mousePositon >= this.progressBoxWidth ? this.progressBoxWidth : mousePositon; //设置最大边界值
			let percentLength = Math.ceil((mousePositon * 100) / this.progressBoxWidth);
			return percentLength;
		},
		// 设置进度条长度
		setProgressBar(length) {
			this.$refs.progressBar.style.width = length + "%";
			this.$refs.radiusBtn.style.left = length + "%";
		},
		// 设置hoverBar
		setHoverBar() {
			this.$refs.hoverBar.style.opacity = "0";
			this.$refs.hoverBar.style.transition = "all 1s ease-out";
			this.$refs.hoverBar.style.width = this.percent + "%";
			setTimeout(() => {
				this.$refs.hoverBar.style.transition = "none";
				this.$refs.hoverBar.style.width = 0;
				this.$refs.hoverBar.style.opacity = "1";
			}, 1000);
		},
		// 鼠标移动时,设置tooltip位置,设置当前位置百分比数值
		setTooltip(e) {
			if (this.disabled) {
				this.$refs.progressBox.style.cursor = "not-allowed";
				return;
			}
			this.$refs.progressBox.style.cursor = "pointer";
			this.isMouseover = true;
			this.isShowToolTip = true;
			let percentLength = this.getMousePositon(e);
			this.$refs.tooltip.style.left = percentLength + "%";
			this.$emit("onMove", percentLength);
			this.length = percentLength;
		},
		//改变进度条progressBar
		changeProgressBar(e) {
			if (this.disabled) return;
			let percentLength = this.getMousePositon(e);
			this.setProgressBar(percentLength);
			this.$emit("onChange", percentLength);
		},
		// 鼠标按下圆形按钮拖拽进度条
		dragProgressBar() {
			// 鼠标移动，拖拽进度条
			let move = e => {
				this.isDrag = true;
				this.$refs.progressBar.style.transition = "none"; // 关闭过渡动画
				this.$refs.radiusBtn.style.transition = "none";
				let percentLength = this.getMousePositon(e);
				this.setTooltip(e);
				this.setProgressBar(percentLength);
			};
			// 鼠标松开，就停止拖拽，让鼠标移动事件解除,并且改变进度条
			let moveup = e => {
				this.isDrag = false;
				document.removeEventListener("mousemove", move);
				this.changeProgressBar(e);
				this.$refs.progressBar.style.transition = "all 0.3s ease-out";
				this.$refs.radiusBtn.style.transition = "all 0.3s ease-out";
				this.mouseLeave();
				document.removeEventListener("mouseup", moveup);
			};
			document.addEventListener("mousemove", move);
			document.addEventListener("mouseup", moveup);
		},
		// 鼠标离开进度条栏
		mouseLeave() {
			this.isShowToolTip = false;
			this.isMouseover = false;
		},
	},
	watch: {
		percent() {
			if (!this.isDrag) {
				this.setProgressBar(this.percent);
				this.setHoverBar();
			}
		},
	},
};
</script>

<style lang="less" scoped>
.progress {
	position: relative;
	// border: 1px solid red;
}
.progressBox {
	position: relative;
	width: 100%;
	height: 8px;
	background-color: #eee;
	border-radius: 4px;
	cursor: pointer;
	z-index: 0;
	/* 已播放的进度条颜色 */
	.progress-bar {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: var(--themeColor);
		border-radius: 4px;
		z-index: 1;
		width: 0;
		/* 改变width时的过渡效果 */
		transition: all 0.3s ease-out;
	}
	/* 悬停显示百分比 */
	.tooltip {
		position: absolute;
		top: -30px;
		transform: translateX(-20px);
		background-color: #303133;
		color: #fff;
		font-size: 12px;
		padding: 5px 6px;
		border-radius: 4px;
		z-index: 2;
		.sanjiao {
			position: absolute;
			bottom: -12px;
			right: 50%;
			transform: translateX(50%);
			width: 0;
			height: 0;
			border: 8px solid;
			border-left-color: transparent;
			border-top-color: #303133;
			border-right-color: transparent;
			border-bottom-color: transparent;
		}
	}
	/* 悬停进度条颜色 */
	.hoverBar {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.35);
		border-radius: 4px;
		z-index: 2;
	}
}
// 进度条小球按钮
.radiusBtn {
	position: absolute;
	top: -50%;
	left: 0;
	transform: translateX(-10px);
	width: 15px;
	height: 15px;
	border-radius: 50%;
	border: 2px solid var(--themeColor);
	background: #fff;
	z-index: 3;
	transition: all 0.3s ease-out;
	&:hover {
		width: 18px;
		height: 18px;
		top: -60%;
		cursor: grab;
	}
}
</style>
