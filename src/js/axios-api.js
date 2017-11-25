import axios from 'axios';
// import router from '../router/index.js';
import Vue from 'vue';
const instance = axios.create();
instance.interceptors.request.use(function(config){
	// console.log("access_token");
	// console.log(localStorage.access_token);
	// console.log(config);
	if(config["url"].indexOf("?") !== -1){
		config["url"] = config["url"] + "&access_token=" + localStorage.access_token;
	}else{
		config["url"] = config["url"] + "?access_token=" + localStorage.access_token;
	}
	return config;
});
export default instance;
