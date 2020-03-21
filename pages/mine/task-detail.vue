<template>
	<view v-if="taskDetail">
		<!-- 任务基础信息 -->
		<view class="backgroundFFF padb1">
			<view class="uni-font2 uni-border uni-media-list_plr padt1 padb2 marb2">{{taskDetail.taskType}}</view>
			<view class="uni-font3 uni-media-list_plr">{{taskDetail.content}}</view>
			<view class="uni-font3 uni-media-list_plr  display-flex">
				<view class=""><uni-icon type="person-filled" size="22" class="uni-marr-5"></uni-icon> {{taskDetail.creator}}</view>
				<view class="fr" v-if="taskDetail.taskVoList ? taskDetail.taskVoList.length ? true : false : false">
				{{taskDetail.taskVoList[0].processTaskName}}</view>
			</view>
			<view class="uni-font3 uni-media-list_plr mart1">
				<view class="uni-border padb2">
					<fa-icon type="calendar-check-o" size="20" color="#666" class="uni-marr-10"></fa-icon>
					{{ctime(taskDetail.createTime, 'yyyy.MM.dd')}}
				</view>
			</view> 
			<!-- 任务分发 -->
			<view class="uni-media-list_plr mart2">
				<view class="uni-font2">分发任务</view> 
				<view class="marl15 uni-font3" v-for="(item, index) in childsList" :key="index">
					<view class=""><uni-icon type="person-filled" size="22" class="uni-marr-5"></uni-icon> {{item.taskName}} {{item.taskVoList[0].processTaskName}}</view>
				</view>
			</view>
		</view> 
		<view class="mart1"> 
			<view class="mart15 ">
				<view class="big-title-view uni-font1 uni-border">
					<text class="title">评论</text> 
				</view>
				<view class="backgroundFFF padt1">
					<uni-segmented-control class="segmented" :current="activeReviewTab" :values="historyStatus" @clickItem="onClickItem" style-type="button" active-color="#ff6955" />
				</view> 
				<!-- 流程 -->
				<scroll-view class="height-control backgroundFFF" scroll-y="true" style="height:calc(100vh - 830upx)">
					<view class="padt15">
						<!-- 状态不为2（回复）显示开始 -->
						<view class="review uni-media-list_plr backgroundFFF" v-if="activeReviewTab != 2">
							<view class="review-header uni-flex uni-row" >
								<view class="img-view uni-flex-item">
									<view class="uni-flex uni-row">
										<view style="flex: auto;"> 
											<text>开始</text>
										</view> 
										<!-- type为2 可点击查看流程详情 -->
										<view class="marl10">{{ctime(taskDetail.createTime, 'yyyy.MM.dd hh:mm:ss')}}</view>
									</view>
								</view>  
							</view> 
						</view>
						<view class="review uni-media-list_plr backgroundFFF" v-for="(item, index) in reviewesList" :key="index">
							<view class="review-header uni-flex uni-row" >
								<view class="img-view uni-flex-item">
									<view class="uni-flex uni-row">
										<view style="flex: auto; display: flex;">
											<view class="img-photo-view"><image :src="item.picture"></image> </view>
											<view class="marl10">{{item.creator}}：</view>
										</view>
										<!-- item.tReviewType == 1 表示评论 -->
										
										<!-- type为2 可点击查看流程详情 -->
										<uni-icon @click="checkReview(item)" v-if="item.tReviewType == 2" class="fr" type="arrowright" size="25"></uni-icon>
									</view>
								</view>  
							</view>
							<view class="content">{{item.commentContent}}</view>
							<view class="uni-font5">{{ctime(item.createTime, 'yyyy.MM.dd hh:mm:ss')}}</view>
						</view>  
						<!-- 状态不为2（回复）显示去完成 -->
						<view class="review uni-media-list_plr backgroundFFF" v-if="activeReviewTab != 2 && taskDetail.taskVoList ? taskDetail.taskVoList.length ? true : false : false">
							<view class="review-header uni-flex uni-row" >
								<view class="img-view uni-flex-item">
									<view class="uni-flex uni-row">
										<view style="flex: auto;"> 
											<text>{{taskDetail.taskVoList[0].processTaskName}}</text>
										</view> 
										<!-- 状态为去完成时，才能操作流程 -->
										<button    
											v-if="activeTab == 0"
											class="fr"
											size="mini" 
											type="primary"
											@click="goFinish()">
												去完成
										</button>
									</view>
								</view>  
							</view> 
						</view>  
						<!-- 状态不为2（回复）显示开始 -->
						<view class="review" v-if="activeReviewTab != 2 && taskDetail.status == 2">
							<view class="review-header uni-flex uni-row" >
								<view class="img-view uni-flex-item">
									<view class="uni-flex uni-row">
										<view style="flex: auto;"> 
											<text>结束</text>
										</view> 
										<!-- type为2 可点击查看流程详情 -->
										<view class="marl10">{{ctime(taskDetail.endTime, 'yyyy.MM.dd hh:mm:ss')}}</view>
									</view>
								</view>  
							</view> 
						</view>
					</view>      
				</scroll-view> 
				<view class="uni-flex uni-row padt1 backgroundFFF"> 
					<input class="uni-input" @input="onKeyInput" :value="reviewContent" placeholder="输入内容" />  
					<uni-icon @click="saveReview" type="paperplane" size="30"></uni-icon>  
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue" 
	import cmdCellItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	import uniCard from "@/components/uni-card/uni-card.vue"
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"  
	import uniIcon from "@/components/uni-icon/uni-icon.vue"  
	export default {
		mounted() {},
		components: {cmdCellItem,uniCard,uniSegmentedControl,uniIcon,faIcon},
		data() {
			return {
				activeTab:  	 0,
				activeReviewTab:  	 0,
				taskId: 			 null,
				taskDetail: 	 null,
				childsList: 	 [],
				historyStatus: ['全部','流程','回复'],
				reviewesList:  [], 
				reviewContent: '', 
			};
		},
		computed: {
			ctime(){
				return function(date,format) {
					if (date)
						return this.$mainUtils._convertDate(date, format)
					else return "未知";
				}
			}
		},
		onLoad: function(option) { 
			this.taskId = option.taskId;
			this.activeTab = parseInt(option.activeTab);
			this.getQueryTaskDtail();
			this._getQueryReviewesList(); 
			this.getQueryChildTaskList();
		}, 
		methods: {
			/* 查询任务详情 */
			getQueryTaskDtail(){
				this.$mainUtils.request("t_tasks/"+this.taskId+"/detail/", {}, "GET", res => {
					if (res) {
						this.taskDetail = res;
					}
				}); 
			},
			/* 查询子任务 */
			getQueryChildTaskList(){
				this.$mainUtils.request("t_tasks/childs/", {id: this.taskId}, "GET", res => {
					if (res) {
						this.childsList = res;
					}
				}); 
			},
			/* 点击查看任务 */
			checkChildTask(){ 
				uni.setStorageSync('taskTypePage', 'childTask');
				uni.setStorageSync('taskTypePageName', '子任务'); 
				if(this.childsList.length){
					uni.navigateTo({
						url:'/pages/mine/task-list'
					})
				}
			},
			/* 评论列表 */
			getQueryReviewesList(status){ 
				let params = {
					status: status ? status : '',
					fromId: this.taskId,
					fromType: 2,
				}
				this.$mainUtils.request("/t_tasks/review/list", params, 'GET', (res) => {
					if(res){
						this.reviewesList = res.rows;
					} 
				}) 
			}, 
			/* 点击切换状态查看不同的回复信息 */
			onClickItem(value){
				this.activeReviewTab = value;
				this._getQueryReviewesList();
			},
			// -------- 不同的状态查询条件不同
			_getQueryReviewesList(){ 
				switch (this.activeReviewTab){
					case 0: //全部
					this.getQueryReviewesList();
						break;
					case 1: //流程
					this.getQueryReviewesList(2);
						break;
					case 2: //回复
					this.getQueryReviewesList(1);
						break;
					default:
						break;
				}
			},
			/* 提交评论 */
			saveReview(){
				var params = {
					commentContent: this.reviewContent,
					fromId: this.taskId,
					fromType: 2,
				}
				this.$mainUtils.request("/t_tasks/review", params, 'POST', (res) => {
					this.reviewContent = '';
					this._getQueryReviewesList();
				}) 
			},
			/* 输入内容 */
			onKeyInput(val){ 
				this.reviewContent = val.detail.value;
			}, 
			/* 查看流程详情页 */
			checkReview(item){ 
				let historyData = {
					formData: item.formData,
					fromType: item.fromType
				}
				uni.setStorageSync('hisToryData', JSON.stringify(historyData))
				uni.navigateTo({
					url: '/pages/mine/task-history'
				})
			},
			/* 点击去完成需要操作的东西 */
		  goFinish(){
				uni.setStorageSync('addTaskFormData', this.taskDetail);
				uni.navigateTo({
					url: '/pages/mine/task-component/task-form'
				})
		  },
		}
	}
</script>
<style lang="scss"> 
	.review{
		padding: 20upx;
		border-bottom: 2upx solid #c8c7cc;
		.review-header{ 
			.img-view{
				image{
					width: 60upx;
					height: 60upx;
				}
			}  
		}
		.content{
			margin-left: 82upx;
		} 
	}
</style>
