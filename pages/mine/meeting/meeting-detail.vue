<template>
	<!-- 会议详情有数据 -->
	<view v-if="meetingDetail"> 
		<view v-if="!isShowMember">
			<view class="backgroundFFF padb1">
				<view class="uni-font2 uni-border uni-media-list_plr padt1 padb2 marb2 mart10">
					{{meetingDetail.meetingContent}} 
					{{_statusConvertFont(meetingDetail.status)}}
				</view> 
				<view class="uni-font3 uni-media-list_plr  mart10">
					<fa-icon type="calendar-check-o" size="20" color="#666" class="uni-marr-10"></fa-icon>
					{{cttime(meetingDetail.beginTime, 'yyyy.MM.dd hh:mm:ss')}} ~ 
					{{cttime(meetingDetail.endTime, 'yyyy.MM.dd hh:mm:ss')}}
				</view>
				<view class="uni-font3 uni-media-list_plr mart10"> 
					<uni-icon type="location-filled"  color="#666" class="uni-marr-10" size="20"></uni-icon>
					{{meetingDetail.meetingPlace}}
				</view>
				<view class="uni-font3 uni-media-list_plr mart10">
					<fa-icon type="user-plus" size="20" color="#666" class="uni-marr-10"></fa-icon>
					参加({{personNum(2)}}/{{meetingDetail.meetingPerson.length}}) 没有回复{{personNum(1)}}
				</view>
				<view class="uni-font3 uni-media-list_plr mart10">  
					<fa-icon type="files-o" size="20" color="#666" class="uni-marr-10"></fa-icon>
					<text v-if="meetingDetail.meetingRecord"  @click="download(meetingDetail.meetingRecord.id)">
						{{meetingDetail.meetingRecord.name}}
					</text>
					<text v-else>暂无</text>
				</view>
				<view class="mart1 text-align-center">
					<button v-if="meetingDetail.currentAffiStatus == 1" @click="participateFun(true)" class="marr30" size="mini">确认参加</button> 
					<button v-if="meetingDetail.currentAffiStatus == 1" @click="goFinish" size="mini">请假</button>
				</view>
			</view>  
			<view class="mart15 ">
				<view class="big-title-view uni-font1 uni-border">
					<text class="title">留言</text> 
				</view>
				<scroll-view class="height-control" scroll-y="true">
					<view class="uni-media-list_plr backgroundFFF" v-for="(item, index) in reviewesList" :key="index">
						<view class="review uni-media-list-body padt1 padb3" >
							<view class="review-header uni-flex uni-row" >
								<view class="img-view uni-flex-item">
									<view class="uni-flex uni-row">
										<view class="img-photo-view"><image :src="item.picture"></image></view>
										<view class="marl10 uni-font5">{{item.creator}}</view>
									</view>
								</view> 
								<view class="uni-flex-item uni-font5">发布时间：{{cttime(item.createTime, 'yyyy.MM.dd')}}</view>
							</view>
							<view class="img-content-view uni-font4">{{item.commentContent}}</view>
						</view> 
					</view>
				</scroll-view>
				<view class="uni-flex uni-row backgroundFFF uni-media-list_plr "> 
					<input class="uni-input" @input="onKeyInput" :value="reviewContent" placeholder="输入内容" />  
					<uni-icon @click="saveReview" type="paperplane" size="30"></uni-icon>   
				</view>
			</view>   
		</view>
		<!-- 显示到会人员 -->
		<view v-if="isShowMember && meetingDetail" class="mart15">
			<uni-segmented-control class="segmented" :current="activeTab" :values="tabs" @clickItem="onClickItem" style-type="button" active-color="#ff6955" />
			<!-- 确认参加，不参加，未响应 -->
			<view v-if="status != 4" class="member-view_fix mart15 mar20">
				<view v-for="(item, index) in meetingDetail.meetingPerson" :key="index" v-if="item.affiStatus == status" class="member-view_item"> 
					<view>
						<image v-if="item.picture" :src="item.picture" />
						<image v-else src="../../../static/images/mine.png" />
					</view>
					<view>{{item.userName}}</view>
				</view>
			</view>
			<!-- 已签到 -->
			<view v-if="status == 4" class="member-view_fix mart15 mar20">
				<view v-for="(item, index) in meetingDetail.signPerson" :key="index" class="member-view_item">
					<view>
						<image v-if="item.picture" :src="item.picture" />
						<image v-else src="../../../static/images/mine.png" />
					</view>
					<view>{{item.userName}}</view>
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
				status: 				 2, //2确认参加，3不参加，1未响应，4已签到
				activeTab: 			 0,		
				tabs:	['确认参加','不参加','未响应','已签到'],
				isShowMember:		 false,
				meetingId: 			 null,
				meetingDetail: 	 null,  
				reviewesList:  	 [], 
				reviewContent: 	 '', 
			};
		},
		computed: {
			cttime() {
				return function (date,format) {
					if(date)
						return this.$mainUtils._convertDate(date, format);
					else 
						return '未知';
				}
			}
		},
		watch:{
			isShowMember(val){  
				if(val){ 
					uni.setNavigationBarTitle({
						title: '参会人员'
					})
				} 
			}
		},
		onBackPress(val) {  
			if(this.isShowMember){
				uni.navigateTo({
					url: '/pages/mine/meeting/meeting-detail?meetingId=' + this.meetingId
				})
				this.isShowMember = !this.isShowMember;
				return false;
			}
			
		},
		onLoad: function(option) {  
			this.meetingId = option.meetingId; 
			this.getQueryMeetingDetail();
			this.getQueryReviewesList(); 
		}, 
		methods: {
			/* 查询任务详情 */
			getQueryMeetingDetail(){
				this.$mainUtils.request("/m_info/detail/"+this.meetingId, {}, "GET", res => {
					if (res) {
						this.meetingDetail = res;
						uni.setNavigationBarTitle({
							title: this.meetingDetail.meetingContent
						})
					}
				}); 
			}, 
			/* 评论列表 */
			getQueryReviewesList(){ 
				let params = { 
					fromId: this.meetingId,
					fromType: 5,
				}
				this.$mainUtils.request("/t_tasks/review/list", params, 'GET', (res) => {
					if(res){
						this.reviewesList = res.rows.reverse();
					} 
				}) 
			},  
			/* 提交评论 */
			saveReview(){
				var params = {
					commentContent: this.reviewContent,
					fromId: this.meetingId,
					fromType: 5,
				}
				this.$mainUtils.request("/t_tasks/review", params, 'POST', (res) => {
					this.reviewContent = '';
					this.getQueryReviewesList();
				}) 
			},
			/* 输入内容 */
			onKeyInput(val){ 
				this.reviewContent = val.detail.value;
			}, 
			/* 
			 * 
			 * 文件下载
			 *  */
			download(id){ 
				this.$mainUtils.download(id,res =>{
					if (res.statusCode === 200) {
						uni.showToast({
							title: '下载成功',
							duration: 2000,
							icon: 'none',
							mask: true
						});
						var filePath = res.tempFilePath;//临时文件路径
						//打开文件
						uni.openDocument({
							filePath: filePath,
							success: function (res) {
								console.log('打开文件成功');
							},
							fail() {
								uni.showToast({
									title: '该文件不支持，无法打开',
									icon: 'none',
									duration: 2000
								})
							}
						}); 
					}
				})
			},
			checkMember(){
				this.isShowMember = true;
			},
			onClickItem(index){
				switch (index){
					case 0:
						this.status = 2; //确认参加
						break;
					case 1:
						this.status = 3; //不参加
						break;
					case 2:
						this.status = 1; //未响应
						break;
					case 3:
						this.status = 4; //已签到
						break;
					default:
						break;
				}
			},
			/*
       * 计算人员不同情况下的数量
       * @params {string/number} status 1表示未响应，2表示参加，3表示未参加
       */
      personNum(status){ 
        let self = this,
            personList = this.meetingDetail.meetingPerson,
            _count = 0;
        personList.forEach( (item) => {
          item.affiStatus == status ? _count++ : _count;
        });
        return _count;
       },
			/*
			 * 状态转文字
			 * @params {string/number} status 状态码
			 */
			_statusConvertFont(status){
			  switch(status){
			    case 1:
			        return '未结束';
			      break;
			    case 2:
			        return '已结束';
			      break;
			    case 3:
			        return '不参加';
			      break;
			    case 20:
			        return '已取消';
			      break;
			    default:
			      break;
			  }
			 },
			/*
       * 参会
       * @params {Boolean} bool 为true参会，false不参会
       */
      participateFun(bool){
				this.$mainUtils.request("m_info/affi/" + this.meetingId, {affiliated: bool}, 'POST', (res) => {
					this.getQueryMeetingDetail();
				})  
       },
			/* 点击去完成需要操作的东西 */
			goFinish(){
				this.meetingDetail.formTypeT = 'metting'
				uni.setStorageSync('addTaskFormData', this.meetingDetail);
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
	.member-view_fix{ 
    display: flex; 
    flex-direction: row;
		.member-view_item{  
			display: flex;
			position: relative;
			-webkit-box-orient: vertical;
			-webkit-box-direction: normal; 
			flex-direction: column;
			width: 25%;
			text-align: center;
			padding: 10px 5px;
			box-sizing: border-box;
			border: 1px solid #c5c5c5; 
			margin-left:-1px ; 
			margin-top:-1px ; 
			image{
				width: 100upx;
				height: 100upx;
			}
		}
	}
</style>
