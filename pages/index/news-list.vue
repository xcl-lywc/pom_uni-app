<template>
	<view>
		<view v-if="!isShowTree">
			<view> 
				<mSearch button="inside" @search="search"></mSearch> 
			</view>
			<view>
				<glance :defaultKey="articleList[0].atId" :data='articleList' :showProps="showProps" @clickKeyword="clickKeyword"></glance>
			</view>
			<scroll-view @scrolltolower="scrollToLower" class="content-list" scroll-y="true">
				<view class="uni-list"> 
					<view class="uni-list-cell mart1" hover-class="uni-list-cell-hover" v-for="(itemNews, indexNews) in newList" :key="indexNews" @click="goToNewsDetail(itemNews.id)">
						<view class="uni-list-cell-navigate  uni-media-list ">
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top uni-font2">{{itemNews.articleName}}</view>
								<view class="subtitle mart20">
									<view class="uni-ellipsis subhead uni-font5">{{itemNews.author}} {{cttime(itemNews.createTime, 'yyyy.MM.dd')}}</view>
									<view class="uni-ellipsis pubdate uni-font5">
										</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more :status="loadingStatus"></uni-load-more>
			</scroll-view>
		</view>
		<my-tree v-if="isShowTree" @treeData="treeDataFun"></my-tree>
	</view> 
</template>

<script> 
	import myTree from  './menu-tree/tree.vue'
	import mSearch from '@/components/mehaotian-search/mehaotian-search.vue'
	import glance from '@/components/jm-glance/jm-glance.vue'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		components: {mSearch,glance,uniLoadMore,myTree},
		data() {
			return { 
				isShowTree: 	 false,
				loadingStatus: 'more',
				newList: 		 		[], 
				searchForm:	 {
					type: 			'',
					pageSize: 	10,
					pageNum:  	1,
					keyWords: 	'',
					partyOrgId: uni.getStorageSync('userInfo').committeeId,
					special: 	 	'',
					
				},  
				articleList: [{atName: '全部', atId: ''}], 
				showProps: 	 {
					label: 'atName',
					keyId: 'atId',
				}, 
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
		onNavigationBarButtonTap(e){
			this.isShowTree = true; 
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
				title:option.atName
			})
			// --- 获取页面参数 -----
			this.searchForm.type = option.atId;
			
		},
		mounted(option) { 
			this.getQueryNews(true);
			this.getQueryArticleType();
		},
		methods: {
			/* 
			 * 根据每个模块Id查询新闻
			 */
			getQueryNews(init){ 
				// ------ 初始化 ----------
				if(init){
					this.searchForm.pageNum = 1;
					this.newList = [];
				}
				this.loadingStatus = "loading"
				this.$mainUtils.request("/a_info/article/list/from_org/"+uni.getStorageSync('userInfo').committeeCode, this.searchForm, 'GET', (res) => {
					this.newList.push(...res.rows); 
					if(res.rows.length == 0 || res.rows.length < this.searchForm.pageSize) { //加载后没有数据 或 返回的数据小于10条(已到末页) 显示为没有更多 并禁止再次加载
					  this.loadingStatus = "noMore"
					} else {
					  this.searchForm.pageNum++;
						this.loadingStatus = 'more'
					}
					
				}); 
			}, 
			/* 查询专题列表 */
			getQueryArticleType(){
				this.$mainUtils.request("/a_types/articletypes/from_org/"+uni.getStorageSync('userInfo').committeeCode, {type: 2}, 'GET', (res) => {
					// ---- 合并数组 ------
					this.articleList.push(...res); 
				})
			},
			goToNewsDetail(newsId){
				uni.navigateTo({url: "/pages/index/news-detail?newsId="+newsId})
			},
			/* 搜索列表 */
			search(ev){ 
				this.searchForm.keyWords = ev;
				this.getQueryNews(true);
			},
			/* 点击获取专题详情 */
			clickKeyword(data){ 
				this.searchForm.special = data.key;
				this.getQueryNews(true);
			},
			/* 滑动到底部加载更多 */
			scrollToLower(){
				if(this.loadingStatus != 'noMore'){
					this.getQueryNews();
				} 
			},
			/* 根据类型Id重查新闻 */
			treeDataFun(data){
				this.isShowTree = false;
				uni.setNavigationBarTitle({
					title: data.atName
				})
				this.searchForm.type = data.atId;
				this.getQueryNews(true);
			}
		}
	}
</script>

<style scoped> 
.content-list {
	/* max-height: calc(100vh - 150px); */
}
</style>
