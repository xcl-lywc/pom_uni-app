<template>
	<view>
		<h1>{{taskName}}</h1>
		<view class="task-info">
			<view class="li">
				<view>分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类 :</view>
				<view class="content">{{taskType}}</view>
			</view>
			<view class="li">
				<view>创建时间 :</view>
				<view class="content">{{createTime}}</view>
			</view>
			<view class="li">
				<view>截止时间 :</view>
				<view class="content">{{endTime}}</view>
			</view>
			<view class="li">
				<view>创&nbsp;&nbsp;建&nbsp;&nbsp;人 :</view>
				<view class="content">{{creator}}</view>
			</view>
			<view class="li">
				<view style="flex: 3;"> </view>
				<view class="sub-task" @click="taskList()"> 查看子任务>></view>
			</view>
		</view>
		<view class="task-info">
			<view class=" row-box">
				<view class="status" v-for="(item,key) in status" :key="key" @click="statusClik(key)">
					<image class="icon" :src="item.url" mode="aspectFill"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
			<uni-steps :data="data" direction="column" :active="data.length -1" todoString="去完成" @todo="todo()">
			</uni-steps>
		</view>
		<view class="task-info">
			回复内容:
			<textarea placeholder="请回复点什么吧!" style="width: 100%;border: #E9EBEC 1upx solid;"></textarea>
			<view class="path" style="margin-top: 10upx;">文件路径:{{filePath?filePath:'未选择'}}</view>
			<tki-file-manager ref="filemanager" @result="resultPath"></tki-file-manager>
			<button type="primary" @tap="openFile" style="margin-top: 10upx;">选择文件</button>
			<button type="warn" @tap="reply" style="margin-top: 10upx;">回复</button>
		</view>
	</view>
</template>

<script>
	import uniSteps from "@/components/uni-steps/uni-steps.vue"
	import tkiFileManager from "@/components/tki-file-manager.vue"
	import {
		taskDetail,
		taskRecord,
		Upload
	} from "@/comm/api.js"
	import {
		timeToDate
	} from "@/comm/utils.js"
	export default {
		mounted() {},
		components: {
			uniSteps,
			tkiFileManager
		},
		data() {
			return {
				taskId: 0,
				taskName: '',
				taskType: '',
				createTime: '',
				endTime: '',
				creator: '',
				fromType: 2,
				taskStatus: '',
				status: [{
						key: 0,
						name: '全部',
						url: '../../static/images/statuts/4.png'
					},
					{
						key: 2,
						name: '流程',
						url: '../../static/images/statuts/one.png'
					},
					{
						key: 1,
						name: '回复',
						url: '../../static/images/statuts/3.png'
					}
				],
				data: [],
				title: '文件选择',
				filePath: '',
			};
		},
		onLoad: function(option) {
			var self = this;
			self.taskId = option.taskId;
			var data = {
				'taskId': self.taskId
			}
			/** 获取任务详情 */
			taskDetail(data, function success(res) {
				self.taskName = res.taskName;
				self.taskType = res.taskType;
				self.createTime = timeToDate(res.createTime);
				self.endTime = timeToDate(res.endTime);
				self.creator = res.creator;
			});
			self.getHistory();
		},
		computed: {
			getCreateTime() {
				return this.createTime;
			}
		},
		methods: {
			/** 获取任务列表 */
			taskList() {
				uni.navigateTo({
					url: '/pages/org/sub-task?taskId=' + this.taskId,
					animationType: 'pop-in',
					animationDuration: 200,
				})
			},
			/** 切换状态 */
			statusClik(index) {
				switch (index) {
					case 0:
						this.taskStatus = "";
						break;
					case 1:
						this.taskStatus = 2;
						break;
					case 2:
						this.taskStatus = 1;
						break;
					default:
						this.taskStatus = "";
						break;
				}
				this.getHistory();
			},
			/** 办理 */
			todo() {},
			/** 获取历史记录 */
			getHistory() {
				var self = this;
				taskRecord({
					fromId: self.taskId,
					fromType: self.fromType,
					status: self.taskStatus
				}, function success(res) {
					if (res && res.rows) {
						var start = {
							title: "开始",
							desc: self.getCreateTime
						};
						var rows = res.rows;
						self.data = [];
						self.data.push(start);
						for (var item in rows) {
							var obj = {
								title: rows[item].commentContent,
								desc: timeToDate(rows[item].createTime)
							}
							self.data.push(obj);
						}
					} else {
						self.data = [];
					}
				});
			},
			/** 文件选择 */
			openFile() {
				var self = this;
				uni.getSystemInfo({
					success: function(res) {
						if (res.platform.toLowerCase() == 'android') {
							self.$refs.filemanager._openFile()
						} else {
							// uni.showModal({content: '不是Android平台而是' + res.platform });
							uni.chooseImage({
								success: (chooseImageRes) => {
									self.filePath = chooseImageRes.tempFilePaths[0];
									self.fileUpload(self.filePath);
								}
							});
						}
					}
				});
			},

			resultPath(e) {
				var self = this
				self.filePath = e
				self.fileUpload(self.filePath);
			},
			/** 回复 */
			reply(e) {

			},
			/** 文件上传 */
			fileUpload(file) {
				var self = this;
				var data = {
					filePath: file,
					taskId: self.taskId
				}
				console.info(file);
				Upload(data, function success(res) {
					var r = JSON.stringify(res);
					console.debug(r)
					uni.showModal({
						content: r
					})
				});
			}
		}
	}
</script>
<style>
	.li {
		display: flex;
		flex-direction: row;
	}

	.task-info {
		margin: 30upx;
		font-size: 28upx;
		padding: 20upx;
		box-shadow: 5px 4px 10px #CCCCCC;
		border-radius: 10upx;
		border: #ECECEC 1upx solid;
	}

	.sub-task {
		color: #606266;
		font-size: 26upx;
		margin: 10upx;
		width: 100%;
		text-align: right;
		flex: 2;
	}

	.content {
		margin-left: 5upx;
	}

	h1 {
		text-align: center;
		margin-top: 15upx;
		font-size: 36upx;
	}

	.row-box {
		display: flex;
	}

	uni-steps {
		margin-left: 20upx;
		margin-top: 20upx;
	}

	.status {
		width: 40upx;
		font-size: 24upx;
		text-align: center;
		letter-spacing: .5px;
		display: flex;
		flex-direction: column;
		flex: 5;
	}

	.status>.icon {
		width: 30upx;
		height: 30upx;
		margin: 0 auto;
		margin-bottom: 5px;
	}

	.path {
		font-size: 14px;
		word-break: break-all;
	}
</style>
