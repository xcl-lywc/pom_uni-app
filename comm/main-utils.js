// export  class API{
/***********************************接口导出**********************************/
export default {
	request,
	_convertDate,
	returnServer,
	returnAlpha,
	download,
	Upload
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
/** 文件上传 */
const FILE_UPLOAD = "file/{0}/uplode";


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
	// uni.showLoading({
	// 	title: '加载中...'
	// })
	url = SERVER + url;
	return uni.request({
		url,
		method,
		data,
		header: {
			'Content-Type': 'application/json;charset=UTF-8', //自定义请求头信息
			'Accept': '*/*',
			'authorization': getToken()
		},
		success(res) {
			uni.hideLoading();
			if (res.data.meta.code == 0) {
				if (success)
					success(analysis(res))
			} else if (res.data.meta.code== 401) {
				logout();
				return;
			} else {
				uni.showToast({
					title: res.data.meta.message,
					duration: 2000,
					icon: 'none',
					mask: true
				});
			}

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
	if (debug) {}
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
/**文件下载 */
function download(data, ok) {
	if (!data) {
		uni.showModal({
			content: '错误的下载参数'
		})
		return;
	}
	const downloadUrl = SERVER + 'file/' + data + '/download';
	const downloadTask = uni.downloadFile({
		url: downloadUrl,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded', //自定义请求头信息
			'Accept': '*/*',
			'authorization': getToken()
		},
		success: ok,
		fail: function f(res) {
			if (res && res.statusCode) {
				const msg = "网络错误:" + res.statusCode;
				if (debug)
					console.info(msg);
				uni.showToast({
					title: '附件下载失败!' + msg,
					icon: 'none',
					duration: 2000
				})
			}
		}
	});
	downloadTask.onProgressUpdate((res) => {
		// console.log('下载进度' + res.progress);
		console.log('已经下载的数据长度' + res.totalBytesWritten);
		// console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);

		// 测试条件，取消下载任务。
		//  if (res.progress > 50) {
		//      downloadTask.abort();
		//  }
	});
}

/** 返回服务器地址 */
function returnServer() {
	return SERVER;
}
/*
 * 将时间戳转换为某年某月某日 00：00：00
 * @params {string/number} timeSetback 时间戳
 * @params {string} format 时间格式
 */
function _convertDate(timeSetback, format) {
	return timeSetback ? new Date(timeSetback).Format(format) : '无';
}

function returnAlpha(index) {
	return String.fromCharCode(index + 65)
}
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