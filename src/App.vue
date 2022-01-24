<template>
	<div id="app">
		<!-- 头部 -->
		<Header />
		<!-- 主体 -->
		<Main />
		<!-- 底部 -->
		<Footer />
	</div>
</template>
<script>
import Header from "./layout/Header.vue";
import Main from "./layout/Main.vue";
import Footer from "./layout/Footer.vue";
export default {
	name: "App",
	components: { Header, Main, Footer },
	created() {
		// 设置主题色
		let defaultTheme = {
			mycomp:"#5292fe",
			theme: "#409eff",
			themeRgba:"rgba(64, 158, 255, 0.8)",
			tagRgba: "rgba(100, 149, 237, 0.2)",
		};
		let currentTheme = localStorage.getItem("currentTheme") ? JSON.parse(localStorage.getItem("currentTheme")) : defaultTheme;
		document.documentElement.style.setProperty("--mycomp-color", currentTheme.theme);
		document.documentElement.style.setProperty("--theme-color", currentTheme.theme);
		document.documentElement.style.setProperty("--theme-rgba", currentTheme.themeRgba);
		document.documentElement.style.setProperty("--tag-rgba", currentTheme.tagRgba);
	},
};
</script>

<style scoped>
@import "assets/css/base.css";
#app {
	width: 100%;
	height: 100vh;
	position: fixed;
}
</style>
