<template>
	<view>
		<!-- 党组织简介 -->
		<view class="org-brief" v-if="getOrgBrief&&getType===2">
			<view class="brief-item">
				<image v-if="getOrgBrief.headImg" class="brief-item-image brief-item-left" style="width: 100px; height: 100px;" mode="scaleToFill" :src="getOrgBrief.headImg"></image>
				<view v-if="!getOrgBrief.headImg"  class="brief-item-image brief-item-left " style="width: 100px; height: 100px;">暂无图片</view>
				<view class="brief-item-info brief-item-left">
					<view>组织名称：<text class="brief-item-content">{{getOrgBrief.name?getOrgBrief.name:'暂无'}}</text></view>
					<view>成立时间：<text class="brief-item-content">{{ctime((getOrgBrief.createrOrgTime?getOrgBrief.createrOrgTime.date_time:null), 'yyyy/MM/dd')}}</text></view>
				</view>
			</view>
			<view class="brief-item" @click="queryUp(getOrgBrief.parentId);">
				<view class="brief-item-title brief-item-left">上级</view>
				<view class="brief-item-arrow brief-item-right" v-if="getOrgBrief.parentId"></view>
				<view class="brief-item-content brief-item-right" v-if="getOrgBrief.parentId">{{getOrgBrief.parentName?getOrgBrief.parentName:'暂无'}}</view>
				<view class="brief-item-content brief-item-right" v-if="!getOrgBrief.parentId">无</view>
			</view>
			<view class="brief-item">
				<view class="overflow-hidden">
					<view class="brief-item-title brief-item-left">组织简介</view>
					<view class="brief-item-arrow brief-item-right"></view>
				</view>
				<view :class=" {'brief-item-content':true,'org-brief-content':isEllipsis}">{{getOrgBrief.description?getOrgBrief.description:'暂无'}}</view>
				<view class="more-position" v-if='isShow' @click="isEllipsis = !isEllipsis">{{isEllipsis==true? '[更多]' :'[收起]'}}</view>
			</view>
			<view class="brief-item">
				<view class="brief-item-title brief-item-left">地址</view>
				<view class="brief-item-arrow brief-item-right"></view>
				<view class="brief-item-content brief-item-right">{{getOrgBrief.address?getOrgBrief.address:'暂无'}}</view>
			</view>
			<view class="brief-item">
				<view class="brief-item-title brief-item-left">电话</view>
				<view class="brief-item-content brief-item-right">{{getOrgBrief.phoneNum?getOrgBrief.phoneNum:'暂无'}}</view>
			</view>
			<view class="brief-item">
				<view class="brief-item-title brief-item-left">邮箱</view>
				<view class="brief-item-content brief-item-right">{{getOrgBrief.email?getOrgBrief.email:'暂无'}}</view>
			</view>
		</view>
		<!-- 企业 -->
		<view class="org-brief" v-if="getOrgBrief&&getType===1">
			<view class="brief-item">
				<image v-if="getOrgBrief.photo" class="brief-item-image brief-item-left" style="width: 100px; height: 100px;" mode="scaleToFill" :src="getOrgBrief.photo"></image>
				<view v-if="!getOrgBrief.photo"  class="brief-item-image brief-item-left" style="width: 100px; height: 100px;color: #C5CAD5;">暂无图片</view>
				<view class="brief-item-info brief-item-left">
					<view>组织名称：<text class="brief-item-content">{{getOrgBrief.name?getOrgBrief.name:'暂无'}}</text></view>
					<view>成立时间：<text class="brief-item-content">{{ctime((getOrgBrief.buildTime?getOrgBrief.buildTime.date_time:null), 'yyyy/MM/dd')}}</text></view>
				</view>
			</view>
			<view class="brief-item" @click="queryUp(getOrgBrief.parentId);">
				<view class="brief-item-title brief-item-left">上级</view>
				<view class="brief-item-arrow brief-item-right" v-if="getOrgBrief.parentId"></view>
				<view class="brief-item-content brief-item-right" v-if="getOrgBrief.parentId">{{getOrgBrief.parentName?getOrgBrief.parentName:'暂无'}}</view>
				<view class="brief-item-content brief-item-right" v-if="!getOrgBrief.parentId">无</view>
			</view>
			<view class="brief-item">
				<view class="overflow-hidden">
					<view class="brief-item-title brief-item-left">组织简介</view>
					<view class="brief-item-arrow brief-item-right"></view>
				</view>
				<view :class=" {'brief-item-content':true,'org-brief-content':isEllipsis}">{{getOrgBrief.description?getOrgBrief.description:'暂无'}}</view>
				<view class="more-position" v-if='isShow' @click="isEllipsis = !isEllipsis">{{isEllipsis==true? '[更多]' :'[收起]'}}</view>
			</view>
			<view class="brief-item">
				<view class="brief-item-title brief-item-left">地址</view>
				<view class="brief-item-arrow brief-item-right"></view>
				<view class="brief-item-content brief-item-right">{{getOrgBrief.address?getOrgBrief.address:'暂无'}}</view>
			</view>
			<view class="brief-item">
				<view class="brief-item-title brief-item-left">电话</view>
				<view class="brief-item-content brief-item-right">{{getOrgBrief.phone?getOrgBrief.phone:'暂无'}}</view>
			</view>
			<view class="brief-item">
				<view class="brief-item-title brief-item-left">邮箱</view>
				<view class="brief-item-content brief-item-right">{{getOrgBrief.mailbox?getOrgBrief.mailbox:'暂无'}}</view>
			</view>
		</view>
		<view v-if="!getOrgBrief" class="no-data">暂无数据</view>
	</view>
</template>

<script>
	export default {
		props:['orgBrief','type'],
		data() {
			return {
				isEllipsis:true,
				isShow:false,
			}
		},
		computed:{
			getOrgBrief(){
				return this.orgBrief
			},
			getType(){
				return this.type
			},
			ctime() {
				return function(date,format) {
					if (date)
						return this.$mainUtils._convertDate(date, format)
					else return "未知";
				}
			}
		},
		created() {
			// this.isShowBtn();
		},
		mounted(){
			console.log(this.$parent)
		},
		methods: {
			queryUp(parentId){
				if(parentId){
					this.$emit('changeNext', parentId);
					this.$emit('getOrgBrief', parentId);
				}
			},
			/* 是否展示战士或收起按钮 */
			isShowBtn(data){
				let length = 0;
				if(data){
					length = data.length;
				}
				let windowWidth = 375;
				console.log(length)
				uni.getSystemInfo({
						success: function (res) {
								console.log();
								windowWidth = res.windowWidth;
						}
				});
				return length >= parseInt((windowWidth - 30)/14)*2 ? this.isShow = true : this.isShow = false;
			}
		}
	}
</script>

<style lang="scss">
	.no-data{
		text-align: center;
		padding: 40upx 0;
		background-color: white;
	}
	.overflow-hidden{
		overflow: hidden;
	}
	.org-brief{
		background-color: #fff;
		overflow: hidden;
		width: 100%;
		.brief-item{
			overflow: hidden;
			border-bottom: 1upx solid #ece4e4;
			margin: 0 30upx;
			padding:20upx 0upx;
			.brief-item-left{
				float: left;
				font-size: 32upx;
			}
			.brief-item-right{
				float: right;
				
			}
			.org-brief-image{
				width: 200upx;;
				border-radius: 10upx;
			}
			.brief-item-info{
				width: calc(100% - 220upx);
				margin-left: 20upx;
				line-height: 40upx;
			}
			.brief-item-title{
				// padding: 0 0 10upx 0;
			}
			.brief-item-content{
				color: #858B9C;
				// margin-right: 10upx;
				font-size: 28upx;
			}
			.org-brief-content{
				width: 100%;
				word-break: break-all;
				display: -webkit-box;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			.more-position{
				color: #666;
				font-size: 24upx;
				text-align: right;
				margin-right: 20upx;
			}
			.brief-item-arrow{
				display: inline-block;
				width: 16upx;
				height: 16upx;
				border: 3upx solid #a3a3a3;
				border-left-width:0; 
				border-bottom-width: 0;
				transform: rotate(45deg);
				margin-left: 12upx;
				margin-right: 12upx;
				margin-top: 16upx;
			}
		}
	}
</style>
