<template>
  <!-- <div id="app"> -->
    <!-- 右侧导航栏 -->
    <!-- <sidebar></sidebar> -->
    
    
    <!-- <section> -->
      <!-- 头部 -->
      <!-- <common-header></common-header> -->

      
    <!-- </section> -->
    
  <!-- </div> -->
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Index from './components/Index/Index'
import Login from './components/Index/Login'
export default {
  name: 'app',
  components:{
    Login,
    Index,
  },
  mounted(){
    if(localStorage.user){
      this.$store.state.user=JSON.parse(localStorage.user);
    }
  },
  computed:{
    user:function(){
      return this.$store.state.user;
    }
  },
  methods: {
  }
}
</script>

<style>
html,body{
  height: 100%;
}
.app {
  font-family: PingFangSC-Light,'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  background: #fff;
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-thumb {
  border-radius: 1em;
  background-color: rgba(50, 50, 50, 0.3);
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(50, 50, 50, 0.6);
}
::-webkit-scrollbar-track {
  border-radius: 1em;
  background-color: rgba(50, 50, 50, 0.1);
}
::-webkit-scrollbar-track:hover {
  background-color: rgba(50, 50, 50, 0.2);
}

</style>
