<template>
	<view class="marb20">
		<!-- swiper -->
		<view class="">
			<view class="page-section swiper" style="100%">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item>
							<image class="swiper-item uni-bg-red" src="http://fx.pinzhi.im:10001/static/banner_big.png?5df6a9f018e9081e2a527bbedaa596da"
							 style="width: 100%;height: 100%;" />
						</swiper-item>
						<swiper-item>
							<image class="swiper-item uni-bg-green" src="http://images.wenming.cn/web_djw/djw2016sy/djw2016dtztc/201604/W020161124384578401337.png"
							 style="width: 100%;height: 100%;"></image>
						</swiper-item>
						<swiper-item>
							<image class="swiper-item uni-bg-blue" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548936968324&di=7cc3c60f6b3bfad451869062dd50fd57&imgtype=0&src=http%3A%2F%2Fpic27.photophoto.cn%2F20130506%2F0017030269129538_b.jpg"
							 style="width: 100%;height: 100%;"></image>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>

		<!-- 导栏 -->
		<uni-grid class="backgroundFFF" :data=menuItems column-num="4" show-border="false" v-on:click="select" style="margin-top: 10upx;">
		</uni-grid>

		<!-- 新闻列表 -->
		<view v-if="dataBlockJson">
			<view v-for="(item, index) in dataBlockJson" :key="index" class="box-view">
				<swiper class="mart15 box-view-img" v-if="item.type == 'swiper' ">
					<swiper-item v-for="(itemImg, indexImg) in item.swiperData" :key="indexImg">
						<navigator :url="itemImg.link">
							<img :src="itemImg.imgUrl" />
							<p>{{itemImg.title}}</p>
						</navigator>
					</swiper-item>
				</swiper>
				<!-- 新闻 -->
				<view v-if="item.type == 'news'" class="mart15 ">
					<view class="big-title-view uni-font1">
						<text class="title">{{item.atName}} </text>
						<view class="check-more" @click="goToMoreNews(item)">
							更多
							<text class="icon-right"></text>
						</view>
					</view>
					<view class="uni-list" v-if="item['newsData' + index]">
						<view class="uni-list-cell mart1" hover-class="uni-list-cell-hover" v-for="(itemNews, indexNews) in item['newsData' + index].rows"
						 :key="indexNews" @click="goToNewsDetail(itemNews.id)">
							<view class="uni-list-cell-navigate  uni-media-list ">
								<view class="uni-media-list-body">
									<view class="uni-media-list-text-top uni-font2">{{itemNews.articleName}}</view>
									<view class="subtitle mart20">
										<view class="uni-ellipsis subhead uni-font5">{{itemNews.author}} {{cttime(itemNews.createTime,'yyyy.MM.dd')}}</view>
										<view class="uni-ellipsis pubdate uni-font5">
											</view>
									</view>
								</view>
							</view>
						</view>
						<view class="uni-list-cell uni-no-data" v-if="item['newsData' + index].rows ? !item['newsData' + index].rows.length : false">暂无新闻</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniCard from "@/components/uni-card/uni-card.vue"
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	export default {
		components: {
			uniGrid,
			uniCard,
			uniList,
			uniListItem,
			uniIcon
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
		mounted: function() {
			if (!this.userInfo) {
				uni.reLaunch({
					url: '/components/Login'
				});
			}
			this.getQueryBlockData();
		},
		activated: function() {
			if (!this.userInfo) {
				uni.reLaunch({
					url: '/components/Login'
				});
			}
		},
		data() {
			return {
				userInfo: uni.getStorageSync('userInfo'),
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				menuItems: [{
						image: '../../static/images/images01.png',
						text: '申请入党',
						url: '/pages/org/applying'
					},
					{
						image: '../../static/images/images02.png',
						text: '党建地图',
						url: '/pages/index/partMap'
					},
					{
						image: '../../static/images/images03.png',
						text: '转正申请',
						url: ''
					},
					{
						image: '../../static/images/images04.png',
						text: '组织关系',
						url: ''
					},
					{
						image: '../../static/images/images05.png',
						text: '党员证明',
						url: ''
					},
					{
						image: '../../static/images/images06.png',
						text: '谈话申请',
						url: ''
					},
					{
						image: '../../static/images/images07.png',
						text: '党费缴纳',
						url: ''
					},
					{
						image: '../../static/images/images08.png',
						text: '个人档案',
						url: ''
					}
				],
				dataBlockJson: null,
			};
		},
		methods: { 
			select(index) {
				var self = this;
				var item = self.menuItems[index.index];
				if (item && item.url){
					uni.navigateTo({
						url: item.url
					})
				}else{ 
					uni.showToast({
						title:	item.text,
						duration:		2000,
						mask:				true,
						icon:	'none',
					})
				}
					
			},
			/*
			 * 查询首页模块
			 * @param {{ String }} typeId 查询ID
			 */
			getQueryBlockData() {
				if (this.userInfo.committeeCode)
					this.$mainUtils.request("home/data/from_org/" + this.userInfo.committeeCode, '', "GET", (res) => {
						this.dataBlockJson = res;
						this._getQueryNews(res);
					});
			},
			/* 
			 * 根据每个模块Id查询新闻
			 */
			_getQueryNews(resData) {
				resData.forEach((item, index) => {
					if (item.type == "news") {
						this.$mainUtils.request("/a_info/article/list/from_org/" + this.userInfo.committeeCode, this._newsParams(item.atId),
							'GET', (res) => {
								item['newsData' + index] = res;
								// -------------------------- 避免页面监听不到数据变化 -----------------------
								this.dataBlockJson = Object.assign({}, this.dataBlockJson, this.dataBlockJson);
							})
					}
				});
			},
			_newsParams(atId) {
				return {
					type: atId,
					pageSize: 7,
					pageNum: 1,
				}
			},
			goToNewsDetail(newsId) {
				uni.navigateTo({
					url: "/pages/index/news-detail?newsId=" + newsId
				})
			},
			goToMoreNews(item) {
				uni.navigateTo({
					url: "/pages/index/news-list?atId=" + item.atId + "&atName=" + item.atName
				});
			},
		}
	}
</script>

<style lang="less">
	.uni-grid{
		background: #ffffff;
	}
	uni-swiper {
		height: 170px;
	}

	.big-title-view {   
		color: #000; 

		.title {
			width: calc(100% - 84upx);
			display: inline-block;
		}

		.check-more {
			width: 84upx;
			display: inline-block;
			color: #9e8383;
		}
	}

	.box-view-img {
		border: 1px solid #c8c7cc; 
	}
</style>
