<template>
  <div class="graph_container">
    <div v-for="item in graph_list" class="graph_list">
      <div class="eachgraph">
        <div class="graph_box">
          <div class="graphMessage" @click="jumpToGraph(item)">
            {{item.name}}
          </div>
        </div>
        <div class="delete">
          <div class="delete"></div>
          <div class="delete_icon" title="'点击删除图'" @click="deleteGraph(item)"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from '../../js/axios-api.js';
  export default {
    data(){
      return{
        graph_list: [],
        addGraphDialog: false
      }
    },
    methods: {
      getAllGraphs(){
        axios.get(this.$store.state.TagUrl + '/api/tag/graphs').then(res => {
          if(res.data.code === 0){
            this.graph_list = res.data.data;
          }else{
            this.$message.error(res.data.msg);
          }
        })
      },
      deleteGraph(item){
        axios.delete(this.$store.state.TagUrl + '/api/tag/graphs/'+ item.id).then(res => {
          if(res.data.code === 0){
            this.$message.success('成功删除！');
            location.reload();
          }else{
            this.$message.error(res.data.msg);
          }
        });
      },
      jumpToGraph(item){
//        this.$store.state.graph_item = {
//          graph_now: item
//        };
        sessionStorage.setItem("graph_item",JSON.stringify({
          graph_now: item
        }));
        console.log(item.id);
        if(item.id === 'c3eab98ecd0b0d827eabe92c7c5aec1c'){
          this.$router.push('/cause');
        } else if(item.id === '51ca0e6541ba9b697dab4ce23ad6113d'){
          this.$router.push('/layer');
        } else if(item.id === '3c7c3bbebba30498122beb6e89fbe174'){
          this.$router.push('/lawtag/lawtexttag');
        } else if(item.id === 'adc55fab403eba45b50cfc3ef65d0e87'){
          this.$router.push('/actionplan');
        } else if(item.id === '980ca9b41632ec7964d49137f8ca1c3b'){
          this.$router.push('/riskass');
        } else {
          this.$router.push('/newgraph');
        }
      }
    },
    mounted(){
      this.getAllGraphs()
    }
  }
</script>
<style lang="less">
  .graph_container{
    overflow: hidden;
    width: 70%;
    height: 70%;
    margin: 150px auto;
    background: #ddd;
    border-radius: 5px;
    position: relative;
    .graph_list{
      .eachgraph{
        float: left;
        width: 14%;
        height: 150px;
        background: #fafcfb;
        margin: 10px 10px;
        border-radius: 10px;
        font-size: 16px;
        color: #999;
        text-align: center;
        position: relative;
        .graphMessage{
          width: 80%;
          height: 70%;
          margin: 20px auto;
          border-radius: 5px;
          background: rgba(0,0,0,0.1);
          line-height: 100px;
          box-shadow: -2px -2px #ccc;
          &:hover{
            cursor: pointer;
            box-shadow: 0px 0px 8px 2px rgba(100, 100, 100, .6);
          }
        }
      }
      &:hover .delete{
        position: absolute;
        right: -8px;
        top: -1px;
        width: 69px;
        height: 69px;
        .delete {
          width: 0;
          height: 0;
          border-top: 59px solid #616B88;
          border-left: 59px solid transparent;
          position: relative;
          left:5px;
          //&:hover{border-top: 69px solid skyblue;border-left: 69px solid transparent;}
        }
        .delete_icon {
          background: url("../../assets/home/delete_case.png") no-repeat center;
          width: 35px;
          height: 35px;
          cursor: pointer;
          position: absolute;
          top: 0px;
          right: 0px;
          img {
            margin: 10px;
          }
        }
      }
    }
  }
</style>
<style scoped>
  .eachgraph{
    overflow: hidden;
  }
  .graphMessage{
    animation: graphMessage 5s linear infinite;
  }
  .graph_box{
    animation: graph_box 5s linear infinite;
  }
  @keyframes graphMessage{
    0% {
      transform: rotateX(0deg) rotateZ(0deg);
    }
    50% {
      transform: rotateX(50deg) rotateZ(180deg);
    }
    100% {
      transform: rotateX(0deg) rotateZ(360deg);
    }
  }

  @keyframes graph_box {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(-360deg);
    }
  }
</style>
