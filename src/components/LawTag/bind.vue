<template>
    <div id="band">
       <div class="title">
          <div class="heading">是否将以下标签链与文本关联<i @click="cancel" class="el-icon-close"></i></div>
       </div>
       <div class="chain">
	       	<el-tooltip placement="top" v-for="item in list.data">
	       		<div slot="content">{{item.name}}</div>
	       		<el-button v-if="item.category == 'tag'" v-text="item.name"></el-button>
            <span v-if="item.category == 'relation'" v-text="item.name"></span>
	       		<!-- <span :id="item.en_name"></span> -->
	       		{{item}}
	       	</el-tooltip>
	       	<el-tooltip placement="top">
	       		<div slot="content">{{list.case_cause.name}}</div>
	       		<el-button class="case" v-if="list.case_cause" v-text="list.case_cause.name"></el-button>
	       		{{list.case_cause}}
	       	</el-tooltip>
       </div>
       <div class="content">
           <div class="text">{{content}}</div>
       </div>
       <div class="btn">
           <el-button id="cancel" @click="cancel">取消</el-button>
           <el-button id="confirm" @click="confirm">关联</el-button>
       </div>
    </div>
</template>

<script>
export default{
  props: {
    list: Object,
    content: String,
  },
	data(){
		return{
		}
	},
  methods:{
    cancel(){
      this.$emit('cancelBind');
    },
    confirm(){
      this.$emit('construct');
    }
  }
}
</script>

<style lang="less">
  #band{
    width:101%;
    margin-top:-3.5%;
    margin-left:-0.5%;
    margin-right:-0.5%;
    .title{
      width:100%;
      height:55px;
      background:#2282E9;
      .heading{
        color:#fff;
        font-size:18px;
        margin-left:20px;
        line-height:55px;
        i{
          color:#fff;
          background:#2282E9;
          float:right;
          line-height:inherit;
          margin-right:20px;
          cursor:pointer;
        }
      }
    }
  	.chain{
  		width:95%;
      margin-top:5%;
      padding-left:5%;
  		border-bottom: 2px dotted #D2D2D2; 
  		button{
  			background:#fff;
  			color: #1278E7;
  			border-radius:5px;
  			border: 1px solid #1278E7;
  			font-size: 16px;
  			margin-bottom: 40px;
  		}
  		.case{
  			color: #F7BA2A;
  			border: 1px solid #F7BA2A;
  		}
  		> span{
        position: relative;
        display: inline-block;
        color: #37BE29;
        font-size: 16px;
        line-height:initial;
        top: -10px;
        padding: 2px 12px;
        width:initial;
        border-bottom: 1px solid #37BE29;
        text-align:center;
  			cursor:pointer;
  		} 
  	}
    .content{
      width: 90%;
      margin: auto;
      margin-top:3%;
      .text{
        font-size:18px;
        line-height: 20px;
        letter-spacing: 2px;
      }
    }
    .btn{
      width:90%;
      margin:auto;
      margin-top:5%;
      margin-bottom:2%;
      display:flex;
      justify-content:space-around;
      .el-button{
        height:36px;
        line-height:inherit;
        width: 120px;
        padding: 0 5px;
        border-radius:20px;
        font-size:16px;
        color:#fff;
      }
      #cancel{
        background:#A4BAD2;
      }
      #confirm{
        background:#2282E9;
      }
    }
  }
</style>
