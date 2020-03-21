<template>
	<view>
		<view class="top-tabs">
			<uni-segmented-control class="segmented" :current="activeTab" :values="tabs" @clickItem="onClickItem" style-type="button"
			 active-color="#ff6955" />
		</view>
		<view class="content-list">
			<scroll-view @scrolltolower="scrollToLower" scroll-y="true">
				<view v-for="(item, index) in cardData.rows" :key="index" class='uni-mart-20'>
					<!-- <uni-card :is-full="true" :extra="'创建者：'+item.creator.name" :title="item.theme" @click="cardClicked(item)" :note="'创建时间:'+ctime(item.createTime)" :beginTime="ctime(item.beginTime)" :endTime="ctime(item.endTime)" :initiatores="item.initiatores" :address="item.address" :talkers="item.talkers" :messageNum="item.messageNum">
					</uni-card> -->
					<uni-card :is-full="true" :title="item.theme" @click="cardClicked(item)" :beginTime="ctime(item.beginTime)" :endTime="ctime(item.endTime)" :address="item.address" :bottomInfo="item.messageNum+'|'+item.creator.name+'|'+ctime(item.createTime)">
					</uni-card>
				</view>
				<uni-load-more :status="loadingStatus"></uni-load-more>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/static/css/uni.css'
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import uniCard from "@/components/uni-card/conversation-uni-card.vue"
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		components: {
			uniCard,
			uniSegmentedControl,
			uniLoadMore,
			uniIcon
		},
		data() {
			return {
				tabs: ['未开始', '已结束', '已取消', '由我创建'],
				activeTab: 0,
				cardData: {
					rows: [],
					total: 0
				},
				loadingStatus: "more",
				currentPage: 1,
				pageSize: 10,
			};
		},
		computed: {
			tabValue() { //返回当前tab的index对应的值
				let value = null
				switch (this.activeTab) {
					case 0:
						value = 1;
						break;
					case 1:
						value = 10;
						break;
					case 2:
						value = 3;
						break;
					case 3:
						value = null;
						break;
					default:
						value = null;
						break;
				}
				return value
			},
			ctime() {
				return function(date) {
					if (date)
						return this.$mainUtils._convertDate(date, 'yyyy-MM-dd hh:mm')
					else return "未知";
				}
			}
		},
		mounted() {
			this.getList(true)
		},
		methods: {
			/**
			 * 点击顶部tabs 还原分页
			 */
			onClickItem(index) {
				if (this.activeTab !== index) {
					this.activeTab = index;
					this.currentPage = 1
					this.getList(true)
				}
			},
			/**
			 * 查询列表 下拉页面时 查询成功后currentPage++ 如查询为空 则将加载改为 已无更多
			 */
			getList(init) {
				let self = this
				this.loadingStatus = "loading"
				if (init) { //初始化查询时重置list数组
					self.cardData.rows = []
				}
				let params = {};
				if (this.activeTab !== 3) {
					params = {
						pageNum: this.currentPage,
						pageSize: this.pageSize,
						creator: uni.getStorageSync("userInfo").userId,
						initiator: uni.getStorageSync("userInfo").userId,
						noteTaker: uni.getStorageSync("userInfo").userId,
						talker: uni.getStorageSync("userInfo").userId,
						converStatus: this.tabValue,
						type: 1,
					}
				} else {
					params = {
						pageNum: this.currentPage,
						pageSize: this.pageSize,
						creator: uni.getStorageSync("userInfo").userId,
						type: 2,
					}
				}
				this.$mainUtils.request("conversation/conversation/list", params, 'POST', res => {
					if (res) {
						self.cardData.rows.push(...res.rows) //拼接数组
						if (res.rows.length == 0 || res.rows.length < 10) { //加载后没有数据 或 返回的数据小于10条(已到末页) 显示为没有更多 并禁止再次加载
							this.loadingStatus = "noMore"
						} else {
							this.currentPage++
						}
					} else {
						this.loadingStatus = "noMore"
					}
				});
			},
			/**
			 * 点击card 跳转至详情 之前的所有内容将保留
			 */
			cardClicked(item) {
				uni.navigateTo({
					url: "/pages/mine/org-life/conversation/conversation-detail?id=" + item.id
				});
			},
			/**
			 * 滑动到页面底部 分页增加 并查询
			 */
			scrollToLower(par) {
				if (this.loadingStatus != 'noMore')
					this.getList(false)
			}
		}
	}
</script>

<style scoped>
	.top-tabs {
		padding: 20upx 0;
		border-bottom: 2upx solid #ece4e4;
		background: #fff;
	}

	.content-list {
		max-height: calc(100vh - 194upx);
		width: calc(100% - 2upx);
	}
</style>
