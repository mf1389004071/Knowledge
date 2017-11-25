<template>
	<div class="bigBox">
    <div id="topPosition"></div>
		<sidebar></sidebar>
		<section>
      <!-- 头部 -->
      <common-header></common-header>
			<router-view></router-view>
    </section>
    <a href="javascript:scroll(0,0)" style="position: fixed; bottom: 50px; right: 50px"><i id="backTop"></i></a>
	</div>
</template>

<script>
	import Header from '../common/Header'
	import Sidebar from '../common/Sidebar'
	export default {
	  components:{
	    'common-header':Header,
	    'sidebar':Sidebar,
	  },
	  computed:{
	    user:function(){
	        return this.$store.state.user;
	    },
	    username(){
	      	return JSON.parse(this.user.config.data).username
	    }
	  },
	  mounted(){
	  	this.$nextTick(()=>{
	  		this.$store.commit('message',this.username)
	  	})
	  }
	}
</script>

<style lang="less" scoped>
	html,body,.bigBox{
		height: 100%;
		background: #fff;
	}
	.bigBox{
    #topPosition{
      position: absolute;
      top: 0px;
      left: 0px;
    }
		position: relative;
		> section{
			position: relative;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			margin-top: 48px;
		}
		&.sider-open{
			> section{
	        width: 88%;
	        margin-left: 12%;
			}
			.sidebar{
				margin-left: 0px;
			}
		}
	}
  #backTop{
    width: 49px;
    height: 49px;
    display: block;
    z-index: 999;
    background: url('../../assets/top.png') center no-repeat;
  }
</style>
