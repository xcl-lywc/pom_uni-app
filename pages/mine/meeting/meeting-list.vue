<template>
	<scroll-view @scrolltolower="scorllTolower" style="height: 100vh;" scroll-y="true">
		<glance :defaultKey="tabs[0].value" :data='tabs' :showProps="showProps" @clickKeyword="clickKeyword"></glance>
		<view class='uni-mart-20' v-for="(item, index) in listData" :key="index">
			<uni-card 
			  :extra="_statusConvertFont(item.status)"
				:is-full="true"
				:mix-title="false"
				:title="item.meetingContent"
				@click="unClick(item)"
				:note="`${item.creator}  ${$mainUtils._convertDate(item.createTime, 'yyyy.MM.dd hh:mm')}` "> 
				<view><text class="uni-font4">会议地点: {{item.meetingPlace}}</text></view>
				<view><text class="uni-font4">  
					会议时间: {{$mainUtils._convertDate(item.beginTime, 'yyyy.MM.dd hh:mm:ss')}} ~ {{$mainUtils._convertDate(item.endTime, 'yyyy.MM.dd hh:mm:ss')}}
					</text>
				</view>
			</uni-card>
		</view> 
		<uni-load-more :status="loadingStatus"></uni-load-more>
	</scroll-view>
</template>

<script>  
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"  
	import uniCard from "@/components/uni-card/uni-card.vue"
	import glance from '@/components/jm-glance/jm-glance.vue'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"

	export default {
		components: {
			uniSegmentedControl,uniCard,uniIcon,glance,uniLoadMore,
		},
		data() {
			return { 
				loadingStatus: 'more',
				activeTab: 0,
				tabs:[{label: '未结束的', value: '1'},{label: '已结束/取消/不参与的', value: '2'},{label: '我发出的', value: '3'},{label: '有任务的', value: '4'}],
				showProps: {
					label: 'label',
					keyId: 'value',
				},
				searhForm: {
					status:		1,  
					pageSize: 10,
					pageNum:  1,
				},
				listData: 	[],
			};
		},
		onLoad(){
			 
		},
		mounted(){ 
			this.getQueryList(true)
		}, 
		methods: {
			clickKeyword(val) {   
				this.searhForm.status = val.key; 
				this.getQueryList(true)
			}, 
			getQueryList(init){
				if(init){
					this.searhForm.pageNum = 1;
					this.listData = [];
				}
				this.loadingStatus = 'loading';  
				
				this.$mainUtils.request('m_info/list/my', this.searhForm, "GET", res => {
					 if (res) { 
					  this.listData.push(...res.rows) //拼接数组
					  if(res.rows.length == 0 || res.rows.length < 10) { //加载后没有数据 或 返回的数据小于10条(已到末页) 显示为没有更多 并禁止再次加载
					    this.loadingStatus = "noMore"
					  } else {
					    this.searhForm.pageNum++
					  }
					} else {
					  this.loadingStatus = "noMore"
					}
				}); 
			},
			unClick(item){
				uni.navigateTo({
					url:'/pages/mine/meeting/meeting-detail?meetingId='+ item.id
				});
			},
			/* 滑动显示更多 */
			scorllTolower(){ 
				if(this.loadingStatus != 'noMore'){
					this.getQueryList();
				}
			},
			/*
       * 状态转文字
       * @params {string/number} status 状态码
       */
      _statusConvertFont(status){
        switch(status){
          case 1:
              return '未结束';
            break;
          case 2:
              return '已结束';
            break;
          case 3:
              return '不参加';
            break;
          case 20:
              return '已取消';
            break;
          default:
            break;
        }
       },
		}
	}
</script>

<style lang="scss">
	.text-bottom{ 
		color: #8f8f94;
		font-size: 26upx;
		.font-text{
			font-size: 26upx!important;
		}
	}
	.segmented-control{
		margin-top: 20upx;
	}
	.icon{ width: 20upx; height: 20upx;}
	.segmented{
		margin-top: 20upx;
	} 
	.item-footer{
		margin-top: 15upx;
		display: flex;
		width: 100%;
	}
	
</style>