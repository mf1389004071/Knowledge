<template>
  <div class="big-container">
    <div class="lawtagcontainer">
      <div class="lawTagTitle">
        <div class="search">
          <router-link to="/lawtag/lawtagsearch"><span><i id="search-icon" @click="show1 = !show1" style="margin-right: 6px"></i><span>标签</span></span></router-link>
        </div>
        <div class="build">
          <router-link to="/lawtag/lawtagbuild"><span><i id="build-icon" @click="show2 = !show2"></i><span>新建标签</span></span></router-link>
        </div>
        <div class="maintain">
          <router-link to="/lawtag/lawtagfix"><span><i id="maintain-icon" @click="show4 = !show4"></i><span>标签维护</span></span></router-link>
        </div>
      </div>
      <div class="position"></div>
      <div class="lawTagBody">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
  import LawTagBuild from './lawTagBuild.vue'
  import LawTagEdit from './LawTagEdit.vue'
  import LawTagMaintain from './LawTagFix.vue'
  import LawTagSearch from './LawTagSearch.vue'

  export default{
    data() {
      return{
        show1 : false,
        show2 : false,
        show3 : false,
        show4 : false,
        selectParams: [{

        }]
      }
    },
    components: {
      'lawtag-build': LawTagBuild,
      'lawtag-edit': LawTagEdit,
      'lawtag-maintain': LawTagMaintain,
      'lawtag-search': LawTagSearch
    }
  }
</script>
<style lang="less" scoped>
  .big-container{
    width: 100%;
    height: 100%;
    .lawtagcontainer{
      width: 80%;
      height: 100%;
      margin: 150px auto;
      border-radius: 5px;
      position: relative;
      .lawTagTitle{
        margin-top: -60px;
        display: block;
        .search{
          width: 190px;
          height: 70px;
          margin-top: -20px;
          margin-right: -20px;
          position: relative;
          background: url('.././../assets/lawtag/others_background.png') no-repeat center;
        }
        .build{
          width: 190px;
          height: 70px;
          margin-top: -20px;
          margin-right: -20px;
          position: relative;
          background: url('../../assets/lawtag/others_background.png') center no-repeat;
        }
        .maintain{
          width: 190px;
          height: 70px;
          margin-top: -20px;
          margin-right: -20px;
          position: relative;
          background: url('../../assets/lawtag/others_background.png') center no-repeat;
        }
        >div{
          #search-icon{
            width: 28px;
            height: 28px;
            display: inline-block;
            background: url('../../assets/lawtag/searchicon.png') center no-repeat;
          }
          #build-icon{
            width: 28px;
            height: 28px;
            display: inline-block;
            background: url('../../assets/lawtag/buildtag.png') center no-repeat;
          }
          #maintain-icon{
            width: 28px;
            height: 28px;
            display: inline-block;
            background: url('../../assets/lawtag/maintain.png') center no-repeat;
          }
          >a{
            color: #fff;
            text-decoration: none;
            cursor: pointer;
            font-size: 22px;
            font-weight: 500;
            font-style: normal;
            >span{
              width: 160px;
              height: 55px;
              position: relative;
              padding-top: 12px;
              >span{
                position: absolute;
                top: 17px;
                margin-left: 10px;
              }
            }
          }
        }
        >div{
          display: inline-block;
          float: left;
          margin-top: -6px;
          z-index: 100;
          height: 71px;
          width: 130px;
          margin-right: 1px;
          padding-top: 15px;
          border-radius: 5px;
          cursor: pointer;
          position: absolute;
          &:hover{
            text-shadow: 1px 1px;
          }
          >a{
            color: #fff;
            text-decoration: none;
            cursor: pointer;
            width: 130px;
            height: 70px;
            position: relative;
            >span{
              font-family: "微软雅黑";
              font-weight: 500;
              font-size: 20px;
              width: 130px;
              top:20px;
              left: 25px;
              position: absolute;
            }
          }
        }
      }
      .position{
        width: 100%;
        height: 56px;
      }
      .lawTagBody{
        position: absolute;
        top: 67px;
        left:  0px;
        display: block;
        width: 100%;
        height: 100%;
      }

    }
  }
</style>
