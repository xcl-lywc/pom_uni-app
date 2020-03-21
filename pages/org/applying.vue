<template>
	<view>
		<uni-segmented-control class="segmented" :current="current" :values="items" @clickItem="onClickItem"
		 style-type="button" active-color="#ff6955" />
		<view class="content margin-top">
		<!-- 	<view v-show="current === 0"> -->
				<view class="uni-list">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in list[current]" :key="key" @click="onClick(key)">
						<view class="uni-list-cell-navigate  uni-media-list ">
							<!-- <view class="uni-media-list-logo">
								<image v-if="showImg" :src="value.img"></image>
							</view> -->
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top">{{value.title}}</view>
								<view class="subtitle">
									<view class="uni-media-list-text-bottom uni-ellipsis subhead">{{value.subhead}}</view>	
									<view class="uni-media-list-text-bottom uni-ellipsis pubdate">{{value.pubdate}}</view>	
								</view>
								<view class="uni-media-list-text-bottom uni-ellipsis">{{value.content}}</view>
								<view class="item-footer">
									<view class="uni-media-list-text-bottom uni-ellipsis total">
										<image class="icon" src="../../static/images/msg-total.png"></image> 
											{{ value.total }}
										</view>
									<view class="uni-media-list-text-bottom uni-ellipsis finishs">
										<image class="icon" src="../../static/images/item-head.png"></image> 
											{{ value.finishs }}/{{ value.allTask }}
										</view>
								</view>
								
							</view>
						</view>
					</view>
				</view>
			<!--</view>
			 <view v-show="current === 1">
				
			</view>
			<view v-show="current === 2">
				
			</view>
			<view v-show="current === 3">
				
			</view>
			<view v-show="current === 4">
				
			</view> -->
		</view>
	</view>
</template>

<script>
	import  { TaskList } from "@/comm/api.js"
	import { timeToDate } from "@/comm/utils.js"
	import '@/static/css/uni.css'
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	
	export default {
		data() {
			return {
				items: ['未完成', '已完成', '我执行', '我发出', '我抄送'],
				current: 0,
				pageNum:1,
				title: '组织生活',
				// showImg: false,
				list:[],
				total:0,
				userId:uni.getStorageSync('userInfo').userId,
			};
		},
		components: {
			uniSegmentedControl
		},
		methods: {
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
					this.pageNum = 1;
					this.getTaskList(index)
				}
			},
			onClick(index){
				var self = this;
				var taskId = self.list[self.current][index].id;
				 uni.navigateTo({
					url:'/pages/org/task-detail?taskId='+ taskId + '&list='+self.list[0]
				});
			},
			getTaskList(index){
				var self = this;
				if(index <0 || index >= self.items.length)return ;
				var userId
				var data={
					'status':index<2?index + 1:'',
					'pageNum':self.pageNum,
					'type':10,
					'assignee':index ==2 ? self.userId: '',
					'creator':index ==3 ? self.userId: '',
					'copy':index ==4 ? self.userId : ''
					};
				TaskList(data,function success(res){
					if(res.rows.length <= 0){
						uni.showToast({
							title:'暂无数据!',
							icon:'none',
							duration: 2000
						})
					}
					var itemData = []
					for(var i =0;i<res.rows.length;i++){
						var item = res.rows[i];
						itemData.push({
							id:item.id,
							title :item.taskType+":"+item.content,
							content:'截止日期:'+ timeToDate(item.endTime),
							subhead:item.assignee,
							pubdate:timeToDate(item.createTime),
							total:' '+item.reviewVo.total,
							finishs:' '+item.finishs,
							allTask:item.allTask
						})
					}
					var list = [];
					list[index] = itemData
					// self.list[index] = itemData;
					self.list = list;
					
				})
			}
		},
		mounted(){
			var self = this;
			self.getTaskList(self.current)
		}
	}
</script>

<style>
	.segmented-control{
		margin-top: 20upx;
	}
	.segmented{
		margin-top: 20upx;
	}
	.margin-top {
		margin-top: 20upx;
	}
	.uni-media-list-body{
		height: auto;
	}
	.uni-media-list-text-bottom{
		margin-top: 10upx;
	}
	
	.subtitle{
		color: #333333;
		display: flex;
		width: 100%;
	}
	.subhead{
		flex: 5;
		color: #333333;
	}
	.pubdate{
		flex: 3;
		color: #333333;
		text-align: right;
	}
	.item-footer{
		margin-top: 15upx;
		display: flex;
		width: 100%;
	}
	.icon{
		width: 20upx;
		height: 20upx;
	}
	.total,.finishs{
		flex: 5;
	}
</style>