<template> 
	<view v-if="newsDetail" class="">
		<view class="uni-border backgroundFFF">
			<view class="uni-font2 uni-media-list_plr text-center padt1">
				{{newsDetail.articleName}}
			</view>
			<view class="uni-font5 uni-media-list_pl marb2">
				{{newsDetail.author}} {{cttime(newsDetail.createTime, 'yyyy.MM.dd')}}
			</view>
			<!-- 新闻内容 -->
			<view class="uni-media-list_plr backgroundFFF padt1 padb1 uni-article-content">
				<view v-html="newsDetail.articleContent"></view>
			</view> 
			<view class="uni-media-list_plr backgroundFFF padt1 padb1">
				<span>
					<fa-icon @click=" newsLike " :type="newsDetail.isLike ? 'thumbs-up' : 'thumbs-o-up' " size="20"></fa-icon>{{newsDetail.aLisksAomunt}}
				</span>
				<span class="marl10 uni-font5" @click=" learnNews ">学习</span> 
				<span class="marl10 uni-font5" @click=" showErrorModel = true ">报错</span>
			</view>
		</view>  
		<!-- 评论 -->
		<view class="mart15 ">
			<view class="big-title-view uni-font1 uni-border">
				<text class="title">评论</text> 
			</view>
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
			<view class="uni-flex uni-row backgroundFFF uni-media-list_plr"> 
				<input class="uni-input" @input="onKeyInput" :value="reviewContent" placeholder="输入内容" />  
				<uni-icon @click="saveReview" type="paperplane" size="30"></uni-icon> 
				<uni-icon class="marl10" @click="updateCollect" :type="newsDetail.isCollection ? 'heart-2' : 'heart'" size="25"></uni-icon>  
			</view>
		</view> 
		<neil-modal :show="showErrorModel" title="报错" @cancel=" showErrorModel = false " @confirm="saveError()">
			<view class="input-view uni-media-list_plr">
				<view class="input-name">
					<view>内容</view>
					<input type="text" v-model="errorContent" placeholder="请输入内容" />
				</view> 
			</view>
		</neil-modal>
	</view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	import uniIcon from "@/components/uni-icon/uni-icon.vue" 
	import uniCard from "@/components/uni-card/uni-card.vue"
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	export default {
		components:{faIcon, uniCard, uniList, uniListItem, uniIcon, uniBadge, neilModal},
		data() {
			return {
				showErrorModel: false,
				newsId: 			 	 null,
				newsDetail: 	 	 null,
				reviewesList:    [],
				reviewContent:   '',  
				errorContent:    '',
			}
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
		onLoad(option) {
			this.newsId = option.newsId;
		},
		mounted() {
			this.getQueryNewsDetail();
			this.getQueryReviewesList();
		},
		methods: {
			/* 查询新闻详情 */
			getQueryNewsDetail(){
				this.$mainUtils.request("/a_info/"+this.newsId+"/detail/from_org/"+uni.getStorageSync('userInfo').committeeCode, {}, 'GET', (res) => {
					this.newsDetail = res;
				}) 
			},
			/* 评论列表 */
			getQueryReviewesList(){
				let params = {
					status: 2,
					fromId: this.newsId,
					fromType: 1,
				}
				this.$mainUtils.request("/a_reviewes/list", params, 'GET', (res) => {
					if(res){
						this.reviewesList = res.rows;
					} 
				}) 
			},
			/* 输入内容 */
			onKeyInput(val){ 
				this.reviewContent = val.detail.value;
			},
			/* 提交评论 */
			saveReview(){
				var params = {
					commentContent: this.reviewContent,
					fromId: this.newsId,
					fromType: 1,
				} 
				this.$mainUtils.request("/a_reviewes/review", params, 'POST', (res) => { 
					
					uni.showToast({
						title:	'评论成功，等待管理员审核。',
						duration:		2000,
						mask:				true,
						icon:	'none',
					})  
					this.reviewContent = '';
					
					setTimeout( () => {
						this.getQueryReviewesList();
					},2500)
					
					
				}) 
			},
			/* 修改收藏状态 */
			updateCollect(){ 
				this.$mainUtils.request("/a_collection/"+this.newsId+"/1/collect/toggle", {}, 'POST', (res) => {
					this.getQueryNewsDetail()
				}) 
			},
			saveError(){
				this.$mainUtils.request("/a_errors/error", {fromId: this.newsId, fromType: '1', errorContent: this.errorContent}, 'POST', (res) => {
					uni.hideLoading();
					uni.showToast({
						title:		  '报错成功',
						duration:		500,
						mask:				true,
						icon:				'none',
					}); 
					setTimeout( () => {
						this.getQueryNewsDetail()
					}, 500)
				})  
			},
			learnNews(){
				this.$mainUtils.request('/a_info/learn/' + this.newsId, {}, 'GET', (res) => {
					uni.hideLoading();
					uni.showToast({
						title:		  '学习成功',
						duration:		500,
						mask:				true,
						icon:				'none',
					}); 
					setTimeout( () => {
						this.getQueryNewsDetail()
					}, 500)
				})  
			},
			newsLike(){
				this.$mainUtils.request('/a_like/'+ this.newsId +'/1/like', {}, 'GET', (res) => {
					uni.hideLoading();
					uni.showToast({
						title:		  '点赞成功',
						duration:		500,
						mask:				true,
						icon:				'none',
					}); 
					setTimeout( () => {
						this.getQueryNewsDetail()
					}, 500)
				})  
			}
		}
	}
</script>

<style lang="scss">
	.page{
		background-color: #ffffff;
	}
	.news-head{
		border-bottom: 2upx solid #c8c7cc;
		padding: 35upx;
	}
	.review{
		// padding: 20upx;
		border-bottom: 2upx solid #c8c7cc;
	}
	.review-header{ 
		width: 100%;
		.img-view{
			image{
				width: 60upx;
				height: 60upx;
			}
		} 
	}
	.uni-icon{
		line-height: 39px;
	}
	.img-photo-view{
		height: 60upx;
		width: 60upx;
		overflow: hidden;
		border-radius: 50%;
	}
	.img-content-view{
		margin-left: 80upx;
	}
	.uni-article-content {
		img{
			max-width: 100%;
		}
	}
</style>
