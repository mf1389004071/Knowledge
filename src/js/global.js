/**
 * Created by nyf on 16-12-19.
 */
import Vue from "vue";
import element from "element-ui";
import "element-ui/packages/theme-default/lib/index.css";
Vue.use(element);

// 应用客户端地址
var app_remote = process.env.NODE_ENV == 'development' ? 'http://192.168.0.36:8080' : "http://180.96.11.69:8091";
// 应用服务器地址
var app_server_remote = process.env.NODE_ENV == 'development' ? "http://192.168.0.88:9020" : "http://180.96.11.69:8500";

//用户中心服务器地址
//var server_remote = "http://180.96.11.73:9020";
var server_remote = "http://192.168.0.88:8052";

// 认证服务器地址
var auth_server_remote =  process.env.NODE_ENV == 'development' ? "http://192.168.0.88:9010" : "http://180.96.11.73:9010";
// 应用id
var client_id = "ucenter";
// 应用密钥
var client_secret = process.env.NODE_ENV == 'development' ? "3cb4ef5b-3e02-4ed0-baba-44a5a759707f" : "77dd422e-3051-4c06-96c3-9653d4acbe89";

// 图片服务器地址
var image_server_remote = 'http://180.96.11.69:8500';

// 接口调用入口
function CallAPIPlugin(url,method,params,callback,async=true, api_server_remote = app_server_remote){
  // 加入access_token参数
  localStorage.access_token = "bebd6893-bd2a-43a3-992a-efb06e1be0c1";
  if(localStorage.access_token) {
    params["access_token"] = localStorage.access_token;
  }
  $.ajax({
    url:url,
    type:method,
    data:params,
    async: async,
    success:function(response){
      // 打印参数
      console.log(app_server_remote,url,method,params,callback);
      console.log(response);
      if(response.code == 0){
        callback(response.data, response.pager);
      }else if(response.code == 1){
        alert(response.msg);
      }else if(response.code == 3){
        if(localStorage.access_token){
          return;
        }
        localStorage.access_token = response.data.access_token;
      }else if(response.code == 4){
        localStorage.access_token = response.data.access_token;
      }
    },
    dataType:"json",
  })

}

// 前端对接认证模块
function AuthPlugin(){
  var search_params_str = location.search;
  if(search_params_str) {
      var code = location.search.split("?")[1].split("&")[0].split("=")[1];
      if(code == "server_error"){
        localStorage.access_token = "code_error"
      }
      var request_params = {
        "client_id":client_id,
        "client_secret":client_secret,
        "redirect_uri":app_remote,
        "code":code,
      };
      CallAPIPlugin("/api/ucenter/access_token", "POST", request_params, function (data) {
        console.log(data);
        localStorage.access_token = data.access_token;
        localStorage.user = JSON.stringify(data.user);
        // location.href = app_remote;
      },false)
  }else{
    if(!localStorage.access_token){
      location.href = auth_server_remote+"/auth/ticket?redirect_uri="+app_remote+"&client_id="+client_id;
    }
  }

}
AuthPlugin();

// 全局插件
var GlogalPlugin = {
  installed:false,
  body_style:{
    opacity:1
  },
  image_server_remote:image_server_remote,
};
GlogalPlugin.install = function (Vue) {
  if(this.installed){
    return;
  }
  Vue.prototype.CallAPI = CallAPIPlugin;
  Vue.prototype.AuthPlugin = AuthPlugin;
  Vue.prototype.auth_server_remote = auth_server_remote;
  Vue.prototype.client_id = client_id;
  Vue.prototype.app_remote = app_remote;
};
export default GlogalPlugin;
