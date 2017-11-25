<template>
	<div id="search">
		<div class="will searched">


			<div class="search_box">
				<i></i>
				<el-input v-model="keywords" placeholder="请输入关键词" @keyup.native.enter="search">

				</el-input>
			</div>
			<div class="sidebar">
				<ul>
					<li><i></i>可视化图谱列表</li>
					<li><i></i>离婚结果知识图谱</li>
					<li><i></i>离婚请求知识图谱</li>
					<li><i></i>切换为知识链列表</li>
				</ul>
			</div>
		</div>
		<div id="main">

		</div>
	</div>
</template>

<script>
import echarts from 'echarts'
import axios from '../../js/axios-api.js';
	export default{

		data(){
			return {
				options:[],
				value:'',
				loading: false,
				keywords:'',
				links:[],
				data:[],
				option:{
					title:{},
					tooltip:{},
					series:[
						{
							type: 'graph',
	                        layout: 'force',
	                        symbolSize: 80,
	                        edgeSymbol: ['circle', 'arrow'],  //设置箭头
	                        focusNodeAdjacency: true,  //突出显示节点
	                        hoverAnimation:true,
	                        edgeSymbolSize: [3, 10],
	                        color:['#edbe00','#f21c36','#2471ff','#3fbd01'],
	                        edgeLabel: {
	                            normal: {
	                                textStyle: {
	                                    fontSize: 20
	                                }
	                            }
	                        },
	                        force: {
	                            repulsion: 3000,
	                            gravity:0.6,
	                            edgeLength: [10, 100],
	                            // layoutAnimation:true
	                        },
	                        top:35,
	                        right:200,
	                        roam:'scale',
	                        draggable: true,
	                        itemStyle: {

	                        },
	                        lineStyle: {
	                            normal: {
	                                width: 2,
	                                color: 'target',
	                                curveness:.3,
	                            }
	                        },
	                        edgeLabel: {
	                            normal: {
	                                show: true,
	                                formatter: function (x) {
	                                    return x.data.name;
	                                }
	                            }
	                        },
	                        label: {
	                            normal: {
	                                show: true,
	                                textStyle: {
	                                }
	                            }
	                        },
	                        data:[],
	                        links:[],
	                        categories:[]
						}
					]
				}
			}
		},
		methods:{
			search(){
				var _this = this;
				// if(myChart){
				// 	myChart.dispose();
				// }



				// let myChart = echarts.init(document.getElementById('main'));
				axios.get(this.$store.state.url1 + '/api/nlp/knowledge/chain/list?key_word=' + this.keywords)
					.then( (res) => {
						// this.links = res.data.links;
						// this.data = res.data.entities;
						console.log(res);
						// res.data.entities.map((elem, index) {
						// 	elem.id = elem.id + index;
						// })

						this.option.series[0].data = res.data.entities;
						this.option.series[0].links = res.data.links;
						this.option.series[0].categories = res.data.categories;
						let myChart = echarts.init(document.getElementById('main'));
						myChart.setOption(_this.option);

						console.log(this.option);
					}).catch((err) => {
						console.log(err)
					})
			},
		},
		mounted(){
			// this.search();
			// var myChart2 = echarts.init(document.getElementById('main'));
			// axios.get(this.$store.state.url1 + '/api/nlp/knowledge/chain/list')
			// 		.then( (res) => {
			// 			// this.links = res.data.links;
			// 			// this.data = res.data.entities;
			// 			console.log(res)
			// 			this.option.series[0].data = res.data.entities;
			// 			this.option.series[0].links = res.data.links;
			// 			this.option.series[0].categories = res.data.categories;

			// 			myChart2.setOption(this.option);
			// 			console.log(this.option)
			// 		}).catch((err) => {
			// 			console.log(err)
			// 		})
			// let myChart2 = echarts.init(document.getElementById('main'));
	    // this.option = {
	        //         title: { text: '' },
	        //         tooltip: {
	        //             // formatter: function (x) {
	        //             //     return x.data.des;
	        //             // }
	        //         },
	        //         series: [
	        //             {
	        //                 type: 'graph',
	        //                 layout: 'force',
	        //                 symbolSize: 80,
	        //                 // roam: true,  //鼠标缩放和平移
	        //                 edgeSymbol: ['circle', 'arrow'],  //设置箭头
	        //                 focusNodeAdjacency: true,  //突出显示节点
	        //                 hoverAnimation:true,
	        //                 edgeSymbolSize: [3, 8],
	        //                 color:['#edbe00','#f21c36','#2471ff','#3fbd01'],
	        //                 edgeLabel: {
	        //                     normal: {
	        //                         textStyle: {
	        //                             fontSize: 20
	        //                         }
	        //                     }
	        //                 },
	        //                 force: {
	        //                     repulsion: 2200,
	        //                     gravity:0.6,
	        //                     edgeLength: [10, 60],
	        //                     // layoutAnimation:true
	        //                 },
	        //                 top:35,
	        //                 roam:'scale',
	        //                 draggable: true,
	        //                 itemStyle: {
	        //                     // normal: {
	        //                     //     color: '#4b565b'
	        //                     // }
	        //                 },
	        //                 lineStyle: {
	        //                     normal: {
	        //                         width: 2,
	        //                         color: 'target',
	        //                         curveness:.3,
	        //                     }
	        //                 },
	        //                 edgeLabel: {
	        //                     normal: {
	        //                         show: true,
	        //                         formatter: function (x) {
	        //                             return x.data.name;
	        //                         }
	        //                     }
	        //                 },
	        //                 label: {
	        //                     normal: {
	        //                         show: true,
	        //                         textStyle: {
	        //                         }
	        //                     }
	        //                 },
	        //                 // data: [
	        //                 //     // 损害赔偿1
	        //                 //         {
	        //                 //             id:0,
	        //                 //             name: '损害赔偿',
	        //                 //             symbolSize: 100,
	        //                 //             category: "损害赔偿",
	        //                 //             // x:-500,
	        //                 //             // y:500,
	        //                 //         }, {
	        //                 //             id:1,
	        //                 //             name: '无过错方',
	        //                 //             category: "损害赔偿",
	        //                 //             // x:-600,
	        //                 //             // y:600,
	        //                 //         }, {
	        //                 //             id:2,
	        //                 //             name:'离婚',
	        //                 //             category: "损害赔偿",
	        //                 //             // x:-450,
	        //                 //             // y:400,
	        //                 //         },
	        //                 //         {
	        //                 //             id:3,
	        //                 //             name:'重婚',
	        //                 //             category: "旁支",
	        //                 //             // x:-250,
	        //                 //             // y:420,
	        //                 //         },
	        //                 //         {
	        //                 //             id:4,
	        //                 //             name:'家庭暴力',
	        //                 //             category: "旁支",
	        //                 //             // x:-260,
	        //                 //             // y:500,
	        //                 //         },
	        //                 //         {
	        //                 //             id:5,
	        //                 //             name:'同居',
	        //                 //             category: "旁支",
	        //                 //             // x:200,
	        //                 //             // y:300,
	        //                 //         },
	        //                 //         {
	        //                 //             id:6,
	        //                 //             name:'遗弃',
	        //                 //             category: "旁支",
	        //                 //             // x:200,
	        //                 //             // y:300,
	        //                 //         },
	        //                 //         {
	        //                 //             id:7,
	        //                 //             name:'虐待',
	        //                 //             category: "旁支",
	        //                 //             // x:200,
	        //                 //             // y:300,
	        //                 //         },
	        //                 //         {
	        //                 //             id:8,
	        //                 //             name:'有配偶者',
	        //                 //             category: "旁支",
	        //                 //             // x:200,
	        //                 //             // y:300,
	        //                 //         },
	        //                 //     // 损害赔偿

	        //                 //     // 婚姻无效2
	        //                 //         {
	        //                 //             id:9,
	        //                 //             name: '婚姻无效',
	        //                 //             symbolSize: 100,
	        //                 //             category: "婚姻无效",
	        //                 //         },
	        //                 //         {
	        //                 //             id:10,
	        //                 //             name:'不应当结婚',
	        //                 //             category: "婚姻无效",
	        //                 //         },
	        //                 //         {
	        //                 //             id:11,
	        //                 //             name:'亲属关系',
	        //                 //             category: "婚姻无效",
	        //                 //         },
	        //                 //         {
	        //                 //             id:12,
	        //                 //             name:'未达到年龄',
	        //                 //             category: "婚姻无效",
	        //                 //         },
	        //                 //         {
	        //                 //             id:13,
	        //                 //             name:'疾病',
	        //                 //             category: "婚姻无效",
	        //                 //         },
	        //                 //         {
	        //                 //             id:14,
	        //                 //             name:'婚龄',
	        //                 //             category: "婚姻无效",
	        //                 //         },
	        //                 //     // 婚姻无效

	        //                 //     // 离婚3
	        //                 //         {
	        //                 //             id:15,
	        //                 //             name: '离婚',
	        //                 //             symbolSize: 100,
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //         {
	        //                 //             id:16,
	        //                 //             name:'离婚诉讼',
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //         {
	        //                 //             id:17,
	        //                 //             name:'调解无效',
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //         {
	        //                 //             id:18,
	        //                 //             name:'宣告失败',
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //         {
	        //                 //             id:19,
	        //                 //             name:'失踪',
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //         {
	        //                 //             id:20,
	        //                 //             name:'吸毒',
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //         {
	        //                 //             id:21,
	        //                 //             name:'赌博',
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //         {
	        //                 //             id:22,
	        //                 //             name:'感情破裂',
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //         {
	        //                 //             id:23,
	        //                 //             name:'分居大于两年',
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //         {
	        //                 //             id:24,
	        //                 //             name:'分居',
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //         {
	        //                 //             id:25,
	        //                 //             name:'感情不和',
	        //                 //             category: "离婚",
	        //                 //         },
	        //                 //     // 离婚

	        //                 // ],
	        //                 // links: [
	        //                 //     {
	        //                 //         source: 1,
	        //                 //         target: 0,
	        //                 //         name:"有权请求"
	        //                 //     }, {
	        //                 //         source: 2,
	        //                 //         target: 0,
	        //                 //         name:"有权请求"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 3,
	        //                 //         target: 2,
	        //                 //         name:"造成"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 4,
	        //                 //         target: 2,
	        //                 //         name:"造成"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 5,
	        //                 //         target: 2,
	        //                 //         name:"造成"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 6,
	        //                 //         target: 2,
	        //                 //         name:"造成"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 7,
	        //                 //         target: 2,
	        //                 //         name:"造成"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 8,
	        //                 //         target: 5,
	        //                 //         name:''
	        //                 //     },
	        //                 //     {
	        //                 //         source: 10,
	        //                 //         target: 9,
	        //                 //         name:"认定"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 11,
	        //                 //         target: 9,
	        //                 //         name:"认定"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 12,
	        //                 //         target: 9,
	        //                 //         name:"认定"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 3,
	        //                 //         target: 9,
	        //                 //         name:"认定"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 13,
	        //                 //         target: 10,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 14,
	        //                 //         target: 12,
	        //                 //         name:"达到"
	        //                 //     },

	        //                 //     {
	        //                 //         source: 16,
	        //                 //         target: 15,
	        //                 //         name:"准予"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 17,
	        //                 //         target: 15,
	        //                 //         name:"准予"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 18,
	        //                 //         target: 16,
	        //                 //         name:"提出"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 19,
	        //                 //         target: 18,
	        //                 //         name:"申请"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 20,
	        //                 //         target: 17,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 21,
	        //                 //         target: 17,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 22,
	        //                 //         target: 17,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 23,
	        //                 //         target: 17,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 3,
	        //                 //         target: 17,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 4,
	        //                 //         target: 17,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 5,
	        //                 //         target: 17,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 6,
	        //                 //         target: 17,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 7,
	        //                 //         target: 17,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 24,
	        //                 //         target: 23,
	        //                 //         name:"达到"
	        //                 //     },
	        //                 //     {
	        //                 //         source: 25,
	        //                 //         target: 24,
	        //                 //         name:"并且"
	        //                 //     },
	        //                 // ],
	        //                 categories:[
	        //                     // {'name':'婚姻无效'},
	        //                     // {'name':'损害赔偿'},
	        //                     // {'name':'离婚'},
	        //                     // {'name':'旁支'}
	        //                 ],
	        //             }
	        //         ],
	        //     };

	    // myChart.setOption(this.option);
	    	// this.search();
	     //    console.log(this.option,'222222222')
		}
	}
</script>

<style lang="less">

	#search{
		position: fixed;
		top: 48px;
		bottom: 0;
		left: 270px;
		right: 0;
		background: url('../../assets/search/bg.jpg') no-repeat -270px 0 #eff3f4;
		// background-size: contain;
		.will{
			padding-top: 53px;
			position: relative;
			&.searched{
				background: #f6f6f6;
				padding:11px 0;
				.sidebar{
					position: absolute;
					right: 0;
					top: 81px;
					width: 190px;
					border:1px solid #bcd0e5;
					ul{
						li{
							height: 46px;
							line-height: 46px;
							font-size: 16px;
							color: #333;
							padding-left: 43px;
							cursor: pointer;
							position: relative;
							i{
								position: absolute;
								width: 24px;
								height: 100%;
								background: url('../../assets/search/show.png') no-repeat center;
								left: 12px;
							}
							&:first-child{
								background: #0a71de;
								color: #fff;
							}
							&:nth-child(2){
								background: #e8e9ea;
								i{
									background-image: url('../../assets/search/result.png');
								}

							}
							&:nth-child(3){
								background: #f5f7f8;
								i{
									background-image: url('../../assets/search/result.png');
								}
							}
							&:last-child{
								background: #dde7f2;
								color: #2f86e3;
								i{
									background-image: url('../../assets/search/lian.png');
								}
							}

						}
					}
				}
			}
		}
		.search_box{

			margin-left: 270px;
			height: 55px;
			line-height: 55px;
			width: 824px;
			border: 2px solid #3F93EC;
			position: relative;
			background: #fff;
			display: flex;
			justify-content:space-bewteen;
			> i{
				display: inline-block;
				position: relative;
				width: 60px;
				height: 41px;
				margin: 7px 0;
				border-right: 1px solid #3f93ec;
				background: url('../../assets/search/search.png') no-repeat center;
				cursor: pointer;
			}
			.el-input{
				display: inline-block;
				height: 41px;
				line-height: 41px;
				width: 763px;
				margin: 7px 0;
				position: absolute;
				left: 61px;
				.el-input__inner{
					height: 41px;
					border: none;
					padding:13px 16px;
					font-size: 16px;
					color: #AFAFAF;
				}
			}
		}
	}

	#main{
		width: 100%;
		height: 100%;

	}
</style>
