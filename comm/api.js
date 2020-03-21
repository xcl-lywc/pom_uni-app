// export  class API{
/***********************************接口导出**********************************/
export {
	Login,
	Logout,
	TaskList,
	SubTask,
	taskDetail,
	taskRecord,
	Upload,
}

/** 服务器地址 */
const SERVER = 'http://fx.pinzhi.im:18080/';
/** 默认分页大小 */
const pageSize = 10;
/** 调试状态 */
// process.env.NODE_ENV == 'development'
export const debug = true;
const TOKEN_NAME = "authorization_djapp";

/***********************************接口API url定义**********************************/
/** 登录 */
const LOGIN = "login/in";
/** 退出 */
const LOGOUT = "login/out";
/** 任务 */
const TASK_LIST = "t_tasks/list";
/** 子任务 */
const SUB_TASK = "t_tasks/childs";
/** 任务详情 */
const TASK_DETAIL = "t_tasks/{0}/detail";
/** 任务记录 */
const TASK_RECORD = "t_tasks/review/list";
/** 任务上传关联 */
const TASK_FILE_UPLOAD = "t_tasks/file/upload";
/** 文件上传 */
const FILE_UPLOAD = "file/{0}/uplode";


/***********************************接口实现**********************************/
/** 登录 */
function Login(data, success) {
	return request(LOGIN, data, 'POST', res => {
		if (res)
			uni.setStorageSync(TOKEN_NAME, 'Bearer ' + res.token);
		success(res);
	});
}
/** 退出 */
function Logout(success) {
	return request(LOGOUT, null, 'GET', res => {
		if (res) {
			uni.setStorageSync(TOKEN_NAME, null)
		}
		success(res);
	});
}
/** 获取任务 */
function TaskList(data, success) {
	return request(TASK_LIST, data, "GET", res => {
		success(res);
	});
}
/** 获取子任务 */
function SubTask(data, success) {
	return request(SUB_TASK, data, "GET", res => {
		success(res);
	});
}
/** 任务详情 */
function taskDetail(data, success) {
	return request("t_tasks/" + data.taskId + "/detail", data, "GET", res => {
		success(res);
	});
}
/** 任务记录 */
function taskRecord(data, success) {
	return request(TASK_RECORD, data, "GET", res => {
		success(res);
	})
}

/********************************************** 这是分割线 以下是基础设施 *****************************************************/



/** 获取后台令牌 */
function getToken() {
	try {
		return uni.getStorageSync(TOKEN_NAME);
	} catch (e) {
		console.info('获取用户Token失败!')
	}
}

/** 网络请求 */
function request(url, data, method, success) {
	uni.showLoading({
		title: '加载中...'
	})
	url = SERVER + url
	if (data && !data.hasOwnProperty('pageSize')) { //没有分页大小添加默认分页大小
		data.pageSize = pageSize;
	}
	return uni.request({
		url,
		method,
		data,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded', //自定义请求头信息
			'Accept': '*/*',
			'authorization': getToken()
		},
		success(res) {
			uni.hideLoading();
			if (success)
				success(analysis(res))
		},
		fail(res) {
			uni.hideLoading();
			if (res && res.statusCode) {
				const msg = "网络错误:" + res.statusCode;
				if (debug)
					console.info(msg);
				uni.showToast({
					title: msg,
					duration: 2000,
					icon: 'none',
					mask: true
				});
			} else {
				uni.showToast({
					title: '网络错误,请重试',
					duration: 2000,
					icon: 'none',
					mask: true
				});
				return;
			}
		}
	})
}

/** 响应数据解析 */
function analysis(res) {
	uni.hideLoading()
	if (!res) {
		if (debug)
			console.info("服务器返回数据为空")
		return;
	}
	if (debug) { 
	}
	if (res.statusCode != 200) {
		const msg = "请求错误:" + res.statusCode;
		if (debug)
			console.info(msg);
		uni.showToast({
			title: msg,
			duration: 2000,
			icon: 'none',
			mask: true
		});
		return;
	}
	const data = res.data;
	if (data.meta.code != 0) {
		if (data.meta.code == 401) {
			logout();
			return;
		}
		const msg = data.meta.message;
		if (debug)
			console.info(msg);
		uni.showToast({
			title: msg,
			duration: 2000,
			icon: 'none',
			mask: true
		});
		return;
	}
	if (!data) {
		const msg = "暂无数据";
		if (debug)
			console.info(msg);
		uni.showToast({
			title: msg,
			duration: 2000,
			icon: 'none',
			mask: true
		});
		return;
	}
	return data.data;
}
/** 文件上传 */
function Upload(data, ok) {
	if (!data) {
		uni.showModal({
			content: '错误的上传参数'
		})
		return;
	}
	var uploadUrl = FILE_UPLOAD;
	if (data.taskId > 0)
		uploadUrl = SERVER + uploadUrl.format(data.taskId);
	uni.uploadFile({
		url: uploadUrl,
		filePath: data.filePath,
		name: 'file',
		header: {
			'Content-Type': 'application/x-www-form-urlencoded', //自定义请求头信息
			'Accept': '*/*',
			'authorization': getToken()
		},
		// formData: data.param,
		success: ok,
		fail: function f(res) {
			if (res && res.statusCode) {
				const msg = "网络错误:" + res.statusCode;
				if (debug)
					console.info(msg);
				uni.showToast({
					title: '附件上传失败!' + msg,
					icon: 'none',
					duration: 2000
				})
			}
		}
	});
}
// }
function logout(){
	uni.reLaunch({
		url: '/components/Login',
		complete: function() {
			uni.showToast({
				title: '登录过期,请重新登录!',
				duration: 3000,
				mask: true,
				icon: 'none',
				complete:function() {
					uni.clearStorageSync();
				}
			})
		}
	});
}