<template>
	<div class="sidebar">
		<h1 @click="close">法律知识图谱</h1>
    <div class="icon icon-menu" @click="open">
      <i class="logo-icon"></i>
      <router-link to="/search">
        <el-tooltip content="可视化搜索" placement="right">
          <i class="search-icon"></i>
        </el-tooltip>
      </router-link>
      <router-link to="/commongraph">
        <el-tooltip content="通用图谱" placement="right">
          <i class="app-icon"></i>
        </el-tooltip>
      </router-link>
      <router-link to="/lawtag/lawtagsearch">
        <el-tooltip content="标签搜索" placement="right">
          <i class="tag-icon"></i>
        </el-tooltip>
      </router-link>
      <router-link to="/main/recognition">
        <el-tooltip content="实体关系识别" placement="right">
        <i class="law-icon"></i>
        </el-tooltip>
      </router-link>
      <router-link to="6">
        <el-tooltip content="暂无" placement="right">
          <i class="book-icon"></i>
        </el-tooltip>
      </router-link>
      <router-link to="9">
        <el-tooltip content="暂无" placement="right">
          <i class="word-icon"></i>
        </el-tooltip>
      </router-link>
      <router-link to="/strnotext">
        <el-tooltip content="知识图谱构建" placement="right">
          <i class="man-icon"></i>
        </el-tooltip>
      </router-link>
      <router-link to="/manage/manage">
        <el-tooltip content="法律文本管理" placement="right">
          <i class="data-icon"></i>
        </el-tooltip>
      </router-link>
      <el-tooltip content="打开面板" placement="right">
        <i @click="open" class="open-icon"></i>
      </el-tooltip>
    </div>
		<ul>
			<li><router-link to="/search"><i class="item1"></i>搜索</router-link></li>
      <li :class="{is_open:show1}">
        <div @click.stop="show1 = !show1;show2 = false;show3 = false;show4 = false;show5 = false;show6 = false;show7 = false">
          <i class="item2"></i>应用图谱<em class="el-icon-caret-right"></em>
        </div>
        <ul class="maintenance">
          <!--<li><router-link to="1">智能问答</router-link></li>-->
          <!--<li><router-link to="2">裁判文书</router-link></li>-->
          <!--<li><router-link to="3">裁判文书</router-link></li>-->
          <li><router-link to="/cause">案由识别</router-link></li>
          <li><router-link to="/commongraph">通用图谱</router-link></li>
        </ul>
      </li>
      <li :class="{is_open:show2}">
        <div @click.stop="show2 = !show2;show1 = false;show3 = false;show4 = false;show5 = false;show6 = false;show7 = false">
          <i class="item3"></i>法律标签<em class="el-icon-caret-right"></em>
        </div>
        <ul class="maintenance">
          <li><router-link to="/lawtag/lawtagsearch">标签管理</router-link></li>
          <li><router-link to="/layer">概念层次标签图</router-link></li>
          <li><router-link to="/lawtag/lawtexttag">法律文本标签图</router-link></li>
        </ul>
      </li>
      <li :class="{is_open:show3}">
        <div @click="show3 = !show3;show1 = false;show2 = false;show4 = false;show5 = false;show6 = false;show7 = false">
          <i class="item4"></i>法言法语<em class="el-icon-caret-right"></em>
        </div>
        <ul class="maintenance">
          <li><router-link to="/main/recognition">实体&关系识别</router-link></li>
          <li><router-link to="/main/structure">知识图谱构建</router-link></li>
          <li><router-link to="/maintenance/entity">实体&关系维护</router-link></li>
        </ul>
      </li>
      <li :class="{is_open:show4}">
        <div @click="show4 = !show4;show1 = false;show2 = false;show3 = false;show5 = false;show6 = false;show7 = false">
          <i class="item5"></i>裁判文书<em class="el-icon-caret-right"></em>
        </div>
        <ul class="maintenance three">
          <li><router-link to="6">实体&关系识别</router-link></li>
          <li><router-link to="7">知识图谱构建</router-link></li>
          <li><router-link to="8">实体&关系维护</router-link></li>
        </ul>
      </li>
      <li :class="{is_open:show5}">
        <div @click="show5 = !show5;show1 = false;show2 = false;show3 = false;show4 = false;show6 = false;show7 = false">
          <i class="item6"></i>通俗口语<em class="el-icon-caret-right"></em>
        </div>
        <ul class="maintenance three">
          <li><router-link to="9">实体&关系识别</router-link></li>
          <li><router-link to="22">知识图谱构建</router-link></li>
          <li><router-link to="11">实体&关系维护</router-link></li>
          <!--<li><router-link to="/maintenance/relation">关系维护</router-link></li>-->
        </ul>
      </li>
      <li :class="{is_open:show6}">
        <div @click="show6 = !show6;show1 = false;show2 = false;show3 = false;show4 = false;show5 = false;show7 = false">
          <i class="item7"></i>法律专家<em class="el-icon-caret-right"></em>
        </div>
        <ul class="maintenance three">
          <li><router-link to="/strnotext">知识图谱构建</router-link></li>
          <li><router-link to="/maintenance/notext">实体&关系维护</router-link></li>

        </ul>
      </li>
      <li :class="{is_open:show7}">
        <div @click.stop="show7 = !show7;show1 = false;show2 = false;show3 = false;show4 = false;show5 = false;show6 = false">
          <i class="item8"></i>法律数据库管理<em class="el-icon-caret-right"></em>
        </div>
        <ul class="maintenance">
          <li><router-link to="/manage/manage">法律文本管理</router-link></li>
          <li><router-link to="/manage/import">导入新法律文本</router-link></li>
        </ul>
      </li>
		</ul>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				show1 : false,
				show2 : false,
				show3 : false,
        show4 : false,
        show5 : false,
        show6 : false,
        show7 : false,
        show8 : false
			}
		},
		methods:{
			open(){
				$('.bigBox').addClass('sider-open');
				$('.sidebar .icon-menu').css('display', 'none');
			},
			close(){
				if($('.bigBox').hasClass('sider-open')){
					$('.bigBox').removeClass('sider-open');
          $('.sidebar .icon-menu').css('display', 'block');
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.sidebar{
		position: fixed;
		top: 0;
		left: 0;
		width: 270px;
		height: 100%;
		background: #001645;
		text-align: center;
		z-index:1000;
		margin-left: -270px;
		-webkit-transition: all .3s ease;
		   -moz-transition: all .3s ease;
		    -ms-transition: all .3s ease;
		     -o-transition: all .3s ease;
		        transition: all .3s ease;
		.icon-menu{
      position: absolute;
      width: 52px;
      height: 100%;
      background: #001645;
      right: -52px;
      top: 0px;
      >a{
        >i{
          width: 30px;
          height: 25px;
          display: block;
          cursor: pointer;
          margin: 30px 10px;
        }
        .search-icon{
          background: url('../../assets/sidebar/1.png') no-repeat center;
          &:hover{
            background: url('../../assets/sidebar/11.png') no-repeat center;
          }
        }
        .app-icon{
          background: url('../../assets/sidebar/2.png') no-repeat center;
          &:hover{
            background: url('../../assets/sidebar/22.png') no-repeat center;
          }
        }
        .tag-icon{
          background: url('../../assets/sidebar/3.png') no-repeat center;
          &:hover{
            background: url('../../assets/sidebar/33.png') no-repeat center;
          }
        }
        .law-icon{
          background: url('../../assets/sidebar/4.png') no-repeat center;
          &:hover{
            background: url('../../assets/sidebar/44.png') no-repeat center;
          }
        }
        .book-icon{
          background: url('../../assets/sidebar/5.png') no-repeat center;
          &:hover{
            background: url('../../assets/sidebar/55.png') no-repeat center;
          }
        }
        .word-icon{
          background: url('../../assets/sidebar/6.png') no-repeat center;
          &:hover{
            background: url('../../assets/sidebar/66.png') no-repeat center;
          }
        }
        .man-icon{
          background: url('../../assets/sidebar/7.png') no-repeat center;
          &:hover{
            background: url('../../assets/sidebar/77.png') no-repeat center;
          }
        }
        .data-icon{
          background: url('../../assets/sidebar/8.png') no-repeat center;
          &:hover{
            background: url('../../assets/sidebar/88.png') no-repeat center;
          }
        }
      }
      a.router-link-active{
        .search-icon{
          background-image: url('../../assets/sidebar/11.png');
        }
        .app-icon{
          background-image: url('../../assets/sidebar/22.png');
        }
        .tag-icon{
          background-image: url('../../assets/sidebar/33.png');
        }
        .law-icon{
          background-image: url('../../assets/sidebar/44.png');
        }
        .book-icon{
          background-image: url('../../assets/sidebar/55.png');
        }
        .word-icon{
          background-image: url('../../assets/sidebar/66.png');
        }
        .man-icon{
          background-image: url('../../assets/sidebar/77.png');
        }
        .data-icon{
          background-image: url('../../assets/sidebar/88.png');
        }
      }
      .logo-icon{
        display: block;
        width: 34px;
        margin: 40px 7px;
        height: 60px;
        background: url('../../assets/sidebar/0.png') no-repeat center;
      }
      .open-icon{
        width: 30px;
        height: 25px;
        display: block;
        cursor: pointer;
        position: absolute;
        left: 10px;
        bottom: 50px;
        background: url('../../assets/common/close2.png') no-repeat center;
      }
		}
		h1{
			color: #fff;
			height: 165px;
			line-height: 165px;
			font-size: 24px;
			border-bottom: 2px solid #223953;
			font-weight: normal;
			padding-left: 50px;
			background: url('../../assets/logo.png') no-repeat 40px center;
      &:hover{
        cursor: pointer;
      }
		}
		ul{
			font-size: 18px;
			text-align: left;
			> li{
				height: 67px;
				line-height: 67px;
				cursor: pointer;
				&:nth-child(2),&:nth-child(3),&:nth-child(4),&:nth-child(5),&:nth-child(6),&:nth-child(7),&:nth-child(8){
					color: #2f86e3;
					> div{
						position: relative;
						padding-left: 74px;
					}
          .item8{
            position: absolute;
            display: block;
            width: 20px;
            height: 100%;
            background: url('../../assets/data.png') no-repeat center;
            left: 38px;
          }
          .item7{
            position: absolute;
            display: block;
            width: 20px;
            height: 100%;
            background: url('../../assets/man.png') no-repeat center;
            left: 38px;
          }
          .item6{
            position: absolute;
            display: block;
            width: 20px;
            height: 100%;
            background: url('../../assets/words.png') no-repeat center;
            left: 38px;
          }
					.item5{
						position: absolute;
						display: block;
						width: 20px;
						height: 100%;
						background: url('../../assets/books.png') no-repeat center;
						left: 38px;
					}
					.item4{
						position: absolute;
						display: block;
						width: 20px;
						height: 100%;
						background: url('../../assets/lawLanguage.png') no-repeat center;
						left: 38px;
					}
          .item3{
            position: absolute;
            display: block;
            width: 20px;
            height: 100%;
            background: url('../../assets/tag.png') no-repeat center;
            left: 38px;
          }
					.item2{
						position: absolute;
						display: block;
						width: 20px;
						height: 100%;
						background: url('../../assets/goujian.png') no-repeat center;
						left: 38px;
					}
					em{
						transition: transform .3s;
						position: absolute;
					    right: 50px;
					    top: 23px;
					}

				}
				.maintenance{
					display: none;
					-webkit-transition: all .3s;
					   -moz-transition: all .3s;
					    -ms-transition: all .3s;
					     -o-transition: all .3s;
					        transition: all .3s;
					li{
						a.router-link-active{
							border-left: 4px solid #1786ff;
							padding-left: 70px;
						}

					}
				}
				&.is_open{
					height: 100%;
					> div{
						em{
							-webkit-transform: rotate(90deg);
							   -moz-transform: rotate(90deg);
							    -ms-transform: rotate(90deg);
							     -o-transform: rotate(90deg);
							        transform: rotate(90deg);
						}
					}
					.maintenance{
						display: block;
					}
				}
				a{
					color:#2f86e3;
					display: block;
					height: 100%;
					text-decoration: none;
					padding-left: 74px;
					position: relative;
					i{
						position: absolute;
						display: block;
						width: 20px;
						height: 100%;
						background: url('../../assets/search.png') no-repeat center;
						left:38px;
					}
					&.router-link-active{
						color: #fff;
						background: #3D5978;
						.item1{
							background-image: url('../../assets/search2.png');
						}
            .item2{
              background-image: url('../../assets/sidebar/22.png');
            }
            .item3{
              background-image: url('../../assets/sidebar/33.png');
            }
            .item4{
              background-image: url('../../assets/sidebar/44.png');
            }
            .item5{
              background-image: url('../../assets/sidebar/55.png');
            }
            .item6{
              background-image: url('../../assets/sidebar/66.png');
            }
            .item7{
              background-image: url('../../assets/sidebar/77.png');
            }
            .item8{
              background-image: url('../../assets/sidebar/88.png');
            }
						em{
							transform: rotateZ(90deg);
						}
					}
				}
			}
		}
	}
</style>
