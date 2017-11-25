<template>
	<textarea name="" id="" readonly>{{this.$store.state.search.content}}</textarea>
</template>

<script>
	export default{

	}
</script>

<style lang="less" scoped>
	textarea{
		width: 100%;
		height: 110px;
		resize:none;
		border-color: #4078B4;
		color: #000;
		font-size: 16px;
		line-height: 26px;
		padding: 10px 22px;
		box-sizing: border-box;
	}
</style>