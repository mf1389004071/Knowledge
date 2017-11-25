// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui';
import 'element-ui/packages/theme-default/lib/index.css';

Vue.config.productionTip = false;
Vue.use(Element);
Vue.use(Vuex);
/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
  if(to.path == '/'){
  	console.log(1111)
  	next();
  }else{
  	if(localStorage.access_token){
  		console.log(2222)
  		next();
  	}else{
  		console.log(3333)
  		next({path:'/'});
  	}
  }
})
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
