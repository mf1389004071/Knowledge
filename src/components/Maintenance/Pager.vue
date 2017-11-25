<template>
	<el-pagination
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.page_size"
        :current-change="change"
        >
    </el-pagination>
</template>

<script>
	export default {
	  data () {
	    return {
	    }
	  },
	  props:{
	  	'pager':Object
	  },
	  mounted(){
	  },
	  methods:{
	  	change(val){
	  	}
	  }
	}
</script>

<style lang="less">
	.el-pagination{
		width: 1180px;
	    margin-left: 70px;
	    text-align: center;
		.el-pager{
			li.number{
				width: 36px;
				height: 36px;
				line-height: 36px;
				border:1px solid #B2B2B2;
				border-radius: 50%;
				background: #fff;
				font-size: 18px;
				margin: 0 12px;
			}
			li.btn-quicknext, li.btn-quickprev{
				line-height: 36px;
				border: 0 none;
			}
			li.active{
				background: #1278E7;
			}
			li:last-child{
				font-size: 18px !important;
				width: 36px;
				height: 36px !important;
				line-height: 36px !important;
				border:1px solid #B2B2B2 !important;
				border-radius: 50% !important;
			}	
		}
		> button{
			width: 36px;
			text-align: center;
			height: 36px !important;
			line-height: 36px !important;
			background: #B2B2B2 !important;
			border-radius: 50% !important;
			margin: 0 12px !important;
			.el-icon{
				font-size: 18px !important;
				color:#fff;
			}
		}
	}
</style>