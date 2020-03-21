<template>
	<view> 
		<scroll-view @scrolltolower="scrollToLower" class="content-list" scroll-y="true">
			<!-- <uni-card 
				title="积分列表" 
				thumbnail="http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" >
				<cmd-cell-item v-for="(item, index) in scoreCountdata" :key="index" :title="item.name" :addon="`${item.score}分`"></cmd-cell-item>
			</uni-card> -->
			
			
			<view class="score-list-title">积分列表</view>
			<view :style="{'margin-bottom':120+'px','margin-top':0+'px'}">
				<view class="qiun-charts">
					<canvas canvas-id="canvasRadar" id="canvasRadar" class="charts" :style="{'width':cWidth*pixelRatio+'px','height':cHeight*pixelRatio+'px', 'transform': 'scale('+(1/pixelRatio)+')','margin-left':-cWidth*(pixelRatio-1)/2+'px','margin-top':-cHeight*(pixelRatio-1)/2+'px'}"></canvas>
				</view>
			</view>
			
			
			
			<uni-card 
				title="积分历史" 
				thumbnail="http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png" >
				<cmd-cell-item 
					v-for="(item, index) in scoreHistoryData" 
					:key="index" 
					:title='item.date+"你对"+item.typeName+"《"+item.name+"》进行了 "+item.operation+" 的操作； 并获得了积分 "+item.score+" 分"' ></cmd-cell-item>
					<uni-load-more :status="loadingStatus"></uni-load-more>
			</uni-card> 
		</scroll-view>
	</view>
</template>
 
<script> 
	import uniCard from "@/components/uni-card/uni-card.vue"
	import cmdCellItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	
	//引用uCharts
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaRadar=null;
	
	export default {
		components: {uniCard,cmdCellItem,uniLoadMore},
		data() {
			return {
				loadingStatus: 'more',
				scoreHistoryData: [],
				scoreCountdata: 	[],
				totalCount:			  0,
				searchForm: 			{
					pageNum:	1,
					pageSize:	10,
				},
				
				// 积分雷达图配置
				Radar:{
					categories:[],
					series:[{name: '积分',data: []}],
				},
				maxScore:10,//最高积分
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
			}
		},
		mounted() { 
			this.getQueryScoreCount();
			this.getQueryScoreHistory();
		},
		onLoad() {
			// 加载积分雷达图
			_self = this;
			uni.getSystemInfo({
				success: function (res) {
					if(res.pixelRatio>1){
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio =2;
					}
				}
			});
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(400);
			this.getServerData();
		},
		methods: {
			
			getServerData(){
				this.$mainUtils.request("hr_user_score_count/score/count", {}, "GET", res => {
					var Radar = this.Radar;
					var numberArr = [];
					if(res){
						res.forEach( (item) => {
							Radar.categories.push(item.name);
							Radar.series[0].data.push(item.score);
							numberArr.push(item.score)
						})  
					}
					this.maxScore = Math.max.apply( Math, numberArr );
					_self.showRadar("canvasRadar",Radar);
				}); 
			},
			showRadar(canvasId,chartData){
				canvaRadar=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'radar',
					fontSize:12,
					legend:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					animation: true,
					dataLabel: true,
					categories: chartData.categories,
					series: chartData.series,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						radar: {
							max: this.maxScore//雷达数值的最大值(最高积分)
						}
					}
				});
			},
			
			/* 查询打卡日历 */
			getQueryScoreCount(){ 
				this.$mainUtils.request("hr_user_score_count/score/count", {}, "GET", res => {
					res.forEach( (item) => { 
						this.totalCount += item.score;
					})  
					res.push(...[{name:'总分', score: this.totalCount}])
					this.scoreCountdata = res;
				}); 
			}, 
			/* 积分历史 */
			getQueryScoreHistory(){  
				this.loadingStatus = "loading"
				this.$mainUtils.request("hr_user_score/score/history", {pageNum:this.searchForm.pageNum, pageSize: this.searchForm.pageSize}, "GET", res => {
					this.scoreHistoryData.push(...res.rows); 
					if(res.rows.length == 0 || res.rows.length < this.searchForm.pageSize) { //加载后没有数据 或 返回的数据小于10条(已到末页) 显示为没有更多 并禁止再次加载
					  this.loadingStatus = "noMore"
					} else {
					  this.searchForm.pageNum++;
						this.loadingStatus = 'more'
					}
				}); 
			}, 
			/* 滑动到底部加载更多 */
			scrollToLower(){  
				if(this.loadingStatus != 'noMore'){
					this.getQueryScoreHistory();
				} 
			},
		}
	}
</script>

<style scoped>
.content-list {
	height: calc(100vh);
}
.score-list-title{
	margin: 20upx;
  font-size: 32upx;
}
/* 雷达图通用样式 */
/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
.qiun-charts{width: 750upx; height:400upx;background-color: #FFFFFF;}
.charts{width: 750upx; height:400upx;background-color: #FFFFFF;}
</style>
