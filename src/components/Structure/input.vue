<template>
	<div class="str_input">
		<el-input v-model="input" placeholder="请输入内容" @keyup.enter.native="search(input)" @change="reload(input)"></el-input>
	</div>
	
</template>

<script>
	export default {
	  data() {
	    return {
	      input: ''
	    }
	  },
	  methods:{
	  	search(keyword){
	  		this.$emit('search',keyword);
	  	},
	  	reload(keyword){
	  		this.$emit('reload',keyword);
	  	}
	  }
	}
</script>
<style lang="less">
	.str_input{
		.el-input{
			width: 175px;
			.el-input__inner{
				width: 175px;
				height: 32px;
				line-height: 32px;
				border-radius: 30px;
				font-size: 16px;
				color:#575d64;
			}
		}
		// width: 149px;
  //       height: 26px;
  //       line-height: 26px;
  //       border: 0 none;
  //       border-radius: 30px;
  //       outline: none;
  //       font-size: 16px;
  //       color:#575d64;
  //       padding: 2px 13px;
	}
</style>