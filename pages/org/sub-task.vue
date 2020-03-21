<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in list" :key="key">
				<view class="uni-list-cell-navigate  uni-media-list ">
					<!-- <view class="uni-media-list-logo">
								<image v-if="showImg" :src="value.img"></image>
							</view> -->
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{value.taskName}}</view>
						<view class="subtitle">
							<view class="uni-media-list-text-bottom uni-ellipsis subhead">{{value.assignee}}</view>
							<view class="uni-media-list-text-bottom uni-ellipsis pubdate">{{value.createTime}}</view>
						</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{value.endTime}}</view>
						<view class="item-footer">
							<view v-if="value.reviewVo" class="uni-media-list-text-bottom uni-ellipsis total">
								<image class="icon" src="../../static/images/msg-total.png"></image>
								{{ value.reviewVo.total }}
							</view>
							
							<view v-if="value.allTask" class="uni-media-list-text-bottom uni-ellipsis finishs">
								<image class="icon" src="../../static/images/item-head.png"></image>
								{{ value.finishs }}/{{ value.allTask }}
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		SubTask
	} from "@/comm/api.js"
	import {
		timeToDate
	} from "@/comm/utils.js"
	import '@/static/css/uni.css'
	export default {
		data() {
			return {
				taskId: 0,
				list:[]
			};
		},
		onLoad: function(option) {
			var self = this;
			self.taskId = option.taskId;
			var data = {
				'id': self.taskId
			}
			SubTask(data, function success(res) {
				self.list = res;
				for (var index in self.list) {
					var item = self.list[index];
					item.createTime =  timeToDate(item.createTime);
					item.endTime = '截止日期:'+ timeToDate(item.endTime)
				}
			});
		},
	}
</script>

<style>
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
	.uni-list{
		margin: 10upx !important;
		width: auto;
	}
	.uni-list-cell{
		border-radius: 10upx;
		margin: 1upx;
		border: #DDDDDD 1upx solid;
	}
	.uni-list::before{
		background-color: #ffffff;
	}
	.uni-list:after{
		background-color: #ffffff;
	}
</style>
