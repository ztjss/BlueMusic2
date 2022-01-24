<template>
	<div class="theme">
		<div class="theme-item" v-for="(item, index) in themeList" :key="index" @click="changeTheme(item)">
			<div :style="{ background: item.theme }" class="bg"></div>
			<div>{{ item.name }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Themepicker",
	data() {
		return {
			themeList: [
				{
					name: "蓝色",
					mycomp: "#5292fe",
					theme: "#409eff",
					themeRgba: "rgba(64, 158, 255, 0.8)",
					tagRgba: "rgba(100, 149, 237, 0.2)",
				},
				{
					name: "红色",
					mycomp: "#ec4141",
					theme: "#ec4141",
					themeRgba: "rgba(236,65,65,.8)",
					tagRgba: "rgba(236,65,65,.1)",
				},
				{
					name: "绿色",
					mycomp: "#2bb669",
					theme: "#2bb669",
					themeRgba: "rgba(43,182,105,.8)",
					tagRgba: "rgba(43,182,105,.1)",
				},
				{
					name: "橘色",
					mycomp: "#ff8f57",
					theme: "#ff8f57",
					themeRgba: "rgba(255,143,87,.8)",
					tagRgba: "rgba(255,143,87,.1)",
				},
				{
					name: "粉色",
					mycomp: "#ff5c8a",
					theme: "#ff5c8a",
					themeRgba: "rgba(255,92,138,.8)",
					tagRgba: "rgba(255,92,138,.1)",
				},
				{
					name: "金色",
					mycomp: "#e2ab12",
					theme: "#e2ab12",
					themeRgba: "rgba(226,171,18,.8)",
					tagRgba: "rgba(226,171,18,.1)",
				},
			],
		};
	},
	methods: {
		changeTheme(item) {
			document.documentElement.style.setProperty("--mycomp-color", item.mycomp);
			document.documentElement.style.setProperty("--theme-color", item.theme);
			document.documentElement.style.setProperty("--theme-rgba", item.themeRgba);
			document.documentElement.style.setProperty("--tag-rgba", item.tagRgba);
			localStorage.setItem("currentTheme", JSON.stringify(item));
		},
	},
};
</script>

<style lang="less" scoped>
.theme {
	height: 120px;
	padding-top: 10px;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	.theme-item {
		margin-right: 10px;
		width: 30px;
		height: 30px;
		font-size: 12px;
		text-align: center;
		cursor: pointer;
		.bg {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
