<template>
	<view>
		<scroll-view v-show="showType == 'list'" @scrolltolower="scrollToLower" class="content-list" scroll-y="true">
			<view class="uni-list">
				<view class="uni-list-cell mart1" hover-class="uni-list-cell-hover" v-for="(item, index) in cardData.rows" :key="index"
				 @click="cardClicked(item)">
					<view class="uni-list-cell-navigate  uni-media-list ">
						<view class="uni-media-list-body">
							<view class="widthrect"><text class="uni-font2 fl">{{item.lectureTitle}}</text> <text class="uni-font5 fr">{{item.lectureDocent}}</text></view>
							<view class="widthrect mart1">
								<image :src="item.lectureCovers" class="card-img"></image>
							</view>
							<view class="subtitle mart20">
								<view class="text-justify uni-font3">
									<text><i class="icon-people"></i>{{ item.viewer }} <i class="icon-like marl10"></i>{{ item.lectureLike }}</text>
									<!-- <text><i class="icon-like"></i> 点赞数: {{ item.lectureLike }}</text> -->
								</view>
							</view>
							<view class="uni-font5 line-height1">创建时间:{{ item.timeStr }}</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingStatus"></uni-load-more>
		</scroll-view>
		<view v-if="showType == 'detail'">
			<button @click="showType = 'list'">返回</button>
			<detail></detail>
		</view>
	</view>
</template>

<script>
	import '@/static/css/uni.css'
	import uniCard from "@/components/uni-card/uni-card.vue"
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import detail from "./course-detail.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		props: ['isCollect'],
		components: {
			uniCard,
			uniSegmentedControl,
			detail,
			uniLoadMore
		},
		data() {
			return {
				tabs: ['未开始', '进行中', '已结束'],
				activeTab: 0,
				showType: "list", //显示模式 "list"列表 "detail"详情
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
			getIsCollect() {
				return this.isCollect ? this.isCollect : false;
			},
			tabValue() { //返回当前tab的index对应的值
				let value = null
				switch (this.activeTab) {
					case 0:
						value = 2;
						break;
					case 1:
						value = 3;
						break;
					case 2:
						value = 6;
						break;
					default:
						value = 2;
						break;
				}
				return value
			},
			
		},
		mounted() {
			this.getExamList(true)
		},
		methods: {
			/**
			 * 点击顶部tabs 还原分页
			 */
			onClickItem(index) {
				if (this.activeTab !== index) {
					this.activeTab = index;
					this.currentPage = 1
					this.getExamList(true)
				}
			},
			/**
			 * 查询列表 下拉页面时 查询成功后currentPage++ 如查询为空 则将加载改为 已无更多
			 */
			getExamList(init) {
				let self = this

				this.loadingStatus = "loading"

				let params = {
					orgCode: uni.getStorageSync("userInfo").orgCode,
					pageNum: this.currentPage,
					pageSize: this.pageSize,
					collect: this.getIsCollect,
				}

				if (init) { //初始化查询时重置list数组
					self.cardData.rows = []
				}

				this.$mainUtils.request("/l_lecture/list", params, 'GET', res => {
					if (res) {
						self.cardData.rows.push(...res.rows) //拼接数组
						if (res.rows.length == 0 || res.rows.length < 10) { //加载后没有数据 或 返回的数据小于10条(已到末页) 显示为没有更多 并禁止再次加载
							this.loadingStatus = "noMore"
						} else {
							this.currentPage++
						}
						for (var i = 0; i < self.cardData.rows.length; i++) {
							self.cardData.rows[i].timeStr = self.timeFormat(self.cardData.rows[i].created);
						}
					} else {
						this.loadingStatus = "noMore"
					}
				});
			},
			timeFormat(date){
					if (date)
						return this.$mainUtils._convertDate(date, 'yyyy-MM-dd hh:mm')
					else return "";
			},
			/**
			 * 点击card 跳转至详情 之前的所有内容将保留
				constructor		 */
			cardClicked(item) {
				uni.navigateTo({
					url: '/pages/course/course-detail?id=' + item.lectureId
				});
				// this.showType = "detail"
			},
			/**
			 * 滑动到页面底部 分页增加 并查询
			 */
			scrollToLower(par) {
				if (this.loadingStatus != 'noMore')
					this.getExamList(false)
			}
		}
	}
</script>

<style scoped>
	.top-tabs {
		padding: 10px 0;
		border-bottom: 2px solid #cecece;
	}

	.content-list {
		/* max-height: calc(100vh - 105px); */
	}

	.card-img {
		width: 100%;
		height: 225px;
	}

	.text-justify {
		display: flex;
		justify-content: space-between;
	}
</style>
