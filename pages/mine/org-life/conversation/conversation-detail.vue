<template>
	<view class="conversation">
		<view v-if='detailData' class="uni-pad-30">
			<view class="uni-font-32 border-b-1 uni-padt-20 uni-padb-10">{{detailData.theme}}</view>
			<view class="uni-font-32 border-b-1e uni-padt-20 uni-padb-10 box">
				<view class="uni-marb-10">
					<!-- <uni-icon type="time" size="18" class="uni-marr-10"></uni-icon> -->
					<fa-icon type="clock-o" size="18" color="#666" class="uni-marr-10"></fa-icon>
					<text>{{conTime}}</text>
				</view>
				<view class="uni-marb-10">
					<!-- <uni-icon type="location" size="18" class="uni-marr-10"></uni-icon> -->
					<fa-icon type="location-arrow" size="18" color="#666" class="uni-marr-10"></fa-icon>
					<text>{{detailData.address}}</text>
				</view>
				<view class="uni-marb-10">
					<!-- <uni-icon type="location" size="18" class="uni-marr-10"></uni-icon> -->
					<fa-icon type="file-text" size="18" color="#666" class="uni-marr-10 fl"></fa-icon>
					<text class="content fl" :class=" {'brief-ellipsis':isEllipsis}">{{detailData.content}}</text>
					<view class="more-position" v-if='isShow' @click="isEllipsis = !isEllipsis">{{isEllipsis==true? '[更多]' :'[收起]'}}</view>
				</view>
				<view class="uni-marb-1">
					<!-- <uni-icon type="location" size="18" class="uni-marr-10"></uni-icon> -->
					<fa-icon type="file" size="18" color="#666" class="uni-marr-10 fl"></fa-icon>
					<view v-if="detailData.privateFile" class=" file fl">
						<text v-for="item in detailData.privateFile" :key="item" class="item-file" @click="download(item.id)">
							{{item.name}}
						</text>
					</view>
					<view v-if="!detailData.privateFile" class="fl">暂无附件</view>
					<view v-if="detailData.privateFile&&detailData.privateFile.length===0" class="fl">暂无附件</view>
				</view>
			</view>
			<view class="uni-font-32 uni-padt-20 uni-padb-10 box">
				<view class="uni-marb-10 overflow-hidden">
					<text class="fl uni-marr-10">谈话人：</text>
					<view class="file fl" style="width: calc(100% - 70px);">
						<text v-for="item in detailData.initiatorList" :key="item">
							{{item.name+' '}}
						</text>
					</view>
				</view>
				<view class="uni-marb-10">
					<text class="fl uni-marr-10">约谈人：</text>
					<view class="file fl" style="width: calc(100% - 70px);">
						<text v-for="item in detailData.talkerList" :key="item">
							{{item.name+' '}}
						</text>
					</view>
				</view>
				<view class="uni-marb-10">
					<text class="fl uni-marr-10">谈话记录：</text>
					<view v-if="detailData.recordInfo" class="file fl">
						<text class="item-file" @click="download(item.id)">
							{{detailData.recordInfo.name}}
						</text>
					</view>
					<view v-if="!detailData.recordInfo" class="fl">还未上传</view>
				</view>
			</view>
		</view>
		<view>
			<view class="uni-font-32 border-b-1 uni-padt-20 uni-padb-10 uni-background-eee uni-padl-30">沟通记录</view>
			<view class="uni-pad-30">
				<view v-if="reviewData&&reviewData.total === 0">暂无记录</view>
				<view class="uni-comment" v-if="reviewData&&reviewData.total !== 0">
					<view class="uni-comment-list" v-for="item in reviewData.rows" :key="item">
						<view class="uni-comment-face">
							<image :src="item.picture"></image>
						</view>
						<view class="uni-comment-body">
							<view class="uni-comment-top">
								<text>{{item.creator}}</text>
							</view>
							<view class="uni-comment-content">{{item.commentContent?item.commentContent:'暂无'}}</view>
							<view class="uni-comment-date">
								<text class="text-align-right">{{ctime(item.createTime, 'yyyy-MM-dd hh:mm')}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="publish-review">
					<view class="review-area-box">
						<textarea @input="bindTextAreaBlur" :value="review" placeholder="请输入评论" maxlength="-1" class="review-area"/>
					</view>
					<button class="mini-btn review-btn" type="primary" size="mini" @click="publishReview" :disabled="review==''">发布</button>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue'
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	import uniIcon from "@/components/uni-icon/uni-icon.vue" 
	export default {
		components: {
			cmdCellItem,faIcon,uniIcon
		},
		data() {
			return {
				isEllipsis:true,
				isShow:false,
				detailData: null,
				reviewData: {
					rows: [],
					total: 0
				},
				conTime:null,
				review:'',
				fromId:null,
			}
		},
		computed: {
			ctime() {
				return function(date,format) {
					if (date)
						return this.$mainUtils._convertDate(date, format)
					else return "未知";
				}
			}
		},
		watch: {
			review(newValue, oldValue) {
		　　this.review = newValue
		　},
		},
		onLoad(option) {
			option ?　this.fromId = option.id : '';
			this.getDetail(option.id);
			this.getReview(option.id);
			
		},
		methods: {
			/* input获取需发布的评论 */
			bindTextAreaBlur: function (e) {
        this.review = e.detail.value;
      },
			/* 发布评论 */
			publishReview(){
				let formId= this.fromId
				let params = {
				  commentContent: this.review,
				  fromId: formId,
				  fromType: 6,
				}
				this.$mainUtils.request("t_tasks/review", params, 'POST', res => {
					this.review = '';
				  this.getReview(formId);//刷新
				});
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
				return length >= parseInt((windowWidth - 80)/14)*2 ? this.isShow = true : this.isShow = false;
			},
			/* 
			 * 获取详情 
			 * */
			timeFormat(date) {
				if (date)
					return this.$mainUtils._convertDate(date, 'yyyy-MM-dd hh:mm')
				else return "未知";
			},
			getDetail(id) {
				this.$mainUtils.request("conversation/conversation/details", {
					id: id
				}, 'GET', res => {
					if (res) {
						this.detailData = res
						if(res.beginTime){
							this.conTime = this.timeFormat(res.beginTime);
							if(res.endTime)
								this.conTime +="~"+this.timeFormat(res.endTime)
						}
						this.isShowBtn(res.content)
					}
				}, err => {
					uni.showToast({
						title: err.data.meta.message,
						duration: 2000,
						mask: true,
						icon: 'none'
					});
				});
			},
			/* 
			 * 获取评论列表
			 * */
			getReview(id) {
				this.$mainUtils.request("t_tasks/review/list", {
					fromId: id,
					fromType: '6'
				}, 'GET', res => {
					if (res) {
						this.reviewData = res
					}
				}, err => {
					uni.showToast({
						title: err.data.meta.message,
						duration: 2000,
						mask: true,
						icon: 'none'
					});
				});
			},

			/* 
			 * 
			 * 文件下载
			 *  */
			download(id) {
				this.$mainUtils.download(id, res => {
					if (res.statusCode === 200) {
						uni.showToast({
							title: '下载成功',
							duration: 2000,
							icon: 'none',
							mask: true
						});
						var filePath = res.tempFilePath; //临时文件路径
						//打开文件
						uni.openDocument({
							filePath: filePath,
							success: function(res) {
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
						//保存文件至本地
						/* uni.saveFile({
							tempFilePath: filePath,
							success: function (res) {
								console.log('保存文件成功');
							},
							fail() {
								uni.showToast({
									title: '保存文件至本地失败！',
									icon: 'none',
									duration: 2000
								})
							}
						}); */
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.conversation {
		.overflow-hidden{
			overflow:hidden;
		}
		.brief-ellipsis{
			width:calc(100% - 50upx);
			word-break: break-all;
			display: -webkit-box;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
		.box{
			overflow:hidden;
		}
		.content{
			width:calc(100% - 50upx)
		}
		.more-position{
			width: 100%;
			overflow: hidden;
			text-align: right;
		}
		.file {
			// background-color: aqua;
			width: calc(100% - 50upx);
			// text-align: right;

			.item-file {
				color: #2196F3;
				display: inline-block;
				width: 100%;
				// word-wrap: break-word;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				text-decoration: underline;
			}
		}
		.publish-review{
			overflow: hidden;
			.review-area-box{
				width: 100%;
				padding: 20upx;
				box-sizing: border-box;
				border: 1px solid #eee;
				border-radius: 10upx;
				margin-bottom: 10upx;
			}
			.review-area{
				width: 100%;
				height: 100upx;
			}
			.review-btn{
				float: right;
				margin-bottom: 10upx;
			}
		}
	}
</style>

<style scoped lang="scss">
	page {
		background-color: #fff;
	}

	/* comment */
	.uni-comment {
		padding: 5upx 15upx;
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		color: #858B9C;
		max-height: 800upx;
		overflow-y: scroll;
	}

	.uni-comment-list {
		flex-wrap: nowrap;
		padding: 10upx 0;
		margin: 10upx 0;
		width: 100%;
		display: flex;
	}

	.uni-comment-face {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		margin-right: 20upx;
		flex-shrink: 0;
		overflow: hidden;
	}

	.uni-comment-face image {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}

	.uni-comment-body {
		width: 100%;
	}

	.uni-comment-top {
		line-height: 44upx;
		justify-content: space-between;
	}

	.uni-comment-top text {
		color: #333;
		font-size: 24upx;
	}

	.uni-comment-date {
		line-height: 38upx;
		flex-direction: row;
		justify-content: space-between;
		display: flex !important;
		flex-grow: 1;
	}

	.uni-comment-date view {
		color: #666666;
		font-size: 24upx;
		line-height: 38upx;
	}

	.uni-comment-content {
		line-height: 44upx;
		font-size: 28upx;
		padding: 8upx 0;
	}

	.uni-comment-replay-btn {
		background: #FFF;
		font-size: 24upx;
		line-height: 28upx;
		padding: 5upx 20upx;
		border-radius: 30upx;
		color: #333 !important;
		margin: 0 10upx;
	}
</style>
