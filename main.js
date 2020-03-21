import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
App.mpType = 'app' 

/* 引入页面样式文件 */
import '@/static/css/uni.css'
import '@/static/css/icon.css' 
import '@/static/css/common.css' 

import mainUtils from './comm/main-utils'
Vue.prototype.$mainUtils = mainUtils;

const app = new Vue({
    ...App
})
app.$mount()

String.prototype.format = function() {
 if(arguments.length == 0) return this;
 var param = arguments[0];
 var s = this;
 if(typeof(param) == 'object') {
  for(var key in param)
   s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
  return s;
 } else {
  for(var i = 0; i < arguments.length; i++)
   s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
  return s;
 }
}
/*
 *   格式化日期格式
 */
Date.prototype.Format = function (fmt) { 
	var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}