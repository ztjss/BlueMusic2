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
		let currentTheme = this.getItem("currentTheme") ? this.getItem("currentTheme") : null;
		if (currentTheme != null) {
			for (let k in currentTheme) {
				if (k != "title") {
					document.documentElement.style.setProperty(`--${k}`, currentTheme[k]);
				}
			}
		}
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
