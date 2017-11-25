<template>
	<div v-if="show" class="coll">
		<div class="coll_box" id="coll" draggable="true" @dragstart="dragstart" @dragend="dragend" @dragover.prevent="dragover">
			<el-tabs type="card">
				<el-tab-pane>
					<span slot="label" class="tab1">同义词添加</span>
					<div class="tab1_content">
						<el-input v-model="synonyms" @keyup.native.enter="enter" type="textarea" placeholder="光标闪烁区域输入内容"></el-input>
					</div>
				</el-tab-pane>
				<el-tab-pane>
				    <span slot="label" class="tab2">口语化添加</span>
				    <div class="tab2_content">
				    	<el-input v-model="colloquial" @keyup.native.enter="enter" type="textarea" placeholder="光标闪烁区域输入内容"></el-input>
				    </div>
				</el-tab-pane>

			</el-tabs>
			<i class="close" @click="hide"></i>
			<p>
				<el-button @click="save">保存</el-button>
			</p>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				show:false,
				x:'',
				y:'',
				mouseX:'',
				mouseY:'',
				left:'',
				top:'',
				diffX:'',
				diffY:'',
				// 统一词
				synonyms:'',
				// 口语化
				colloquial:'',
				// item:{
				// 	synonyms:'',
				// 	colloquial:''
				// },
				item:{},
			}
		},
		mounted(){

		},
		methods:{
			save(){
				console.log(this.colloquial,this.synonyms);
				const obj = Object.assign(this.item.item,{
						colloquial:this.colloquial.split(/,|，|，|，/),
						synonyms:this.synonyms.split(/,|，|，|，/)
					})
				if(this.item.add){
              		this.$set(this.$parent.Info.addList, this.item.index, obj);
				}else{
					// this.$set(this.$parent.erList.List, this.item.index, obj);
				}
				this.show = false;
			},
			dragover(e){
				// console.log('dragover')
				var drag = document.getElementById('coll');
				this.left = e.clientX - this.diffX;
				this.top = e.clientY - this.diffY;
				if(this.left<270){
		            this.left=270;
		        }else if(this.left >window.innerWidth-drag.offsetWidth){
		            this.left = window.innerWidth-drag.offsetWidth;
		        }
		        if(this.top<0){
		            this.top=0;
		        }else if(this.top >window.innerHeight-drag.offsetHeight){
		            this.top = window.innerHeight-drag.offsetHeight;
		        }
		        drag.style.left = this.left+ 'px';
            	drag.style.top = this.top + 'px';
			},
			dragend(e){
			},
			dragstart(e){
				e.dataTransfer.effectAllowed = "move";  //移动效果
				var drag = document.getElementById('coll');
				this.mouseX = e.clientX;
				this.mouseY = e.clientY;

				this.diffX = e.clientX - drag.offsetLeft;
				this.diffY = e.clientY - drag.offsetTop;

			},
			mousedown(e){
				console.log('move start')
			},
			enter(e){
				var str = $('.coll_box .el-textarea__inner').val();

				console.log(str)
			},
			delCol(tab){
				let str = '';
				if(tab == 'synonyms'){
					str = this.synonyms;
				}else{
					str = this.colloquial;
				}
    			var arr = str.split(/,|，|，|，/);
    			var index = arr[arr.length - 1].indexOf('\n');
    			if(index > -1){
    				arr[arr.length - 1] = arr[arr.length - 1].substring(0,index);
    				str = arr.join("，");
    				if(!str.match(/,|，|，|，$/)){
						str = str + '，';
    				}
    			}else{
    				str = arr.slice(0,arr.length - 1).join("，");
    			}
    			if(str && tab == 'synonyms'){
					this.synonyms = str;
    			}else if(str && tab == 'colloquial'){
    				this.colloquial = str;
    			}else if(!str && tab == 'synonyms'){
    				this.synonyms = '';
    			}else if(!str && tab == 'colloquial'){
    				this.colloquial = '';
    			}

    		},
    		hide(){
    			this.show = false;
    			this.colloquial = '';
    			this.synonyms = '';
    		},
    		coll(){
    			this.show = true;
    		},
		},
		watch:{
		"show":function(val){
		  	if(val){
      			if(this.item.synonyms!=null){
      				this.synonyms=this.item.synonyms.join(',');
      			}else{
      				this.synonyms='';
      			}

      			if(this.item.colloquial!=null){
      				this.colloquial=this.item.colloquial.join(',');
      			}else{
      				this.colloquial='';
      			}
     	 	}
      	}
		}
	}
</script>

<style lang="less">
	.coll{
		position: fixed;
		top: 0;
		bottom:0;
		left:0;
		right:0;
		text-align: center;
		z-index: 112;
		.coll_box{
			position: absolute;
			left: 590px;
			top: 250px;
			text-align: left;
			display: inline-block;
			vertical-align: middle;
			background: #fff;
			width: 664px;
			border:1px solid #2282e9;

			h2{
				height: 64px;
				line-height: 64px;
				background: #2e82e3;
				color: #fff;
				font-size: 18px;
				font-weight: normal;
				padding: 0 30px;
				position: relative;
				cursor: move;
				i{
					position: absolute;
					right: 26px;
					width: 36px;
					height: 100%;
					background: url('../../assets/structure/close.png') no-repeat center;
					cursor: pointer;
				}
			}
			.close{
				position: absolute;
				right: 9px;
				top: 6px;
				width: 36px;
				height: 36px;
				background: url('../../assets/structure/close.png') no-repeat center;
				cursor: pointer;
			}
			.el-textarea{
				textarea{
					resize:none;
					border:0 none;
					height: 213px;
				}
			}
			> p{
				text-align: center;
				height: 58px;
				background: #f8f8f8;
				border-top: 1px solid #e0e0e0;
				line-height: 58px;
				button{
					width: 155px;
					letter-spacing: 4px;
					background: #2282e9;
					color: #fff;
					font-size: 14px;
				}
			}
		}
		.el-tabs__header{
			.el-tabs__nav-wrap{
				background: #2281e9;
				.el-tabs__item{
					color:#99caff;
					font-size: 18px;
					height: 51px;
					line-height: 51px;
					border:0 none;
					&.is-active{
						border:0 none;
						border-radius: 0;
						color: #fff;
						.tab1{
							background-image: url('../../assets/common/same.png');
						}
						.tab2{
							background-image: url('../../assets/common/coll.png');
						}
					}
					& + .el-tabs__item{
						border-left: 1px solid #91c3fb;
					}
					> span{
						display: inline-block;
						height: 100%;
						padding-left: 38px;
						background: url('../../assets/common/same2.png') no-repeat 0;
						&.tab2{
							background-image: url('../../assets/common/coll2.png');
						}
						&::focus{
							outline: none;
						}
					}
				}
			}
		}
		.tab1_content textarea{
			background:url('../../assets/common/same_bg.png') no-repeat center;
		}
		.tab2_content textarea{
			background:url('../../assets/common/coll_bg.png') no-repeat center;
		}
		&:after{
			content: "";
		    display: inline-block;
			height: 100%;
		    width: 0;
		    vertical-align: middle;
		}
	}
</style>
