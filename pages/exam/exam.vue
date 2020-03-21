<template>
  <view class="list-warp">
    <view class="top-tabs" v-show="showType == 'list'">
      <uni-segmented-control class="segmented" :current="activeTab" :values="tabs" @clickItem="clickTabs" style-type="button" active-color="#ff6955" />
    </view>
		<view class="content-list">
			<scroll-view v-show="showType == 'list'" @scrolltolower="scrollToLower" class="" scroll-y="true">
				<view v-for="(item, index) in cardData.rows" class='uni-mart-20'>
					<uni-card 
					  :is-full="true"
						:mix-title="true"
					  :title="ctime(item.beginTime, 'yyyy/MM/dd hh:mm')+'~'+ctime(item.endTime, 'yyyy/MM/dd hh:mm')" 
					  @click="cardClicked(item)"
					  :note="item.userName+' '+ctime(item.createTime, 'yyyy/MM/dd hh:mm')"
						:rightNote="item.joinUser+'|'+item.commentNum">
						<view><text class="uni-font-36">{{ item.theme }}</text></view>
					  <view><text>分值: {{ item.totalScore }}</text></view>
					</uni-card>
				</view>
			  <uni-load-more :status="loadingStatus"></uni-load-more>
			</scroll-view>
		</view>
    
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
  import detail from "./exam-detail.vue"
  import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniIcon from "@/components/uni-icon/uni-icon.vue" 
  export default {
    components: {uniCard, uniSegmentedControl, detail, uniLoadMore,uniIcon},
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
			ctime() {
				return function(date,format) {
					if (date)
						return this.$mainUtils._convertDate(date, format)
					else return "未知";
				}
			},
      tabValue () { //返回当前tab的index对应的值
        let value = null
        switch(this.activeTab) {
          case 0:
            value = 3;
            break;
          case 1:
            value = null;
            break;
          case 2:
            value = 4;
            break;
          default:
            value = 2;
            break;
        }
        return value
      },
			tabValue_ () { //返回当前tab的index对应的值
			  let value = null
			  switch(this.activeTab) {
			    case 0:
			      value = 1;
			      break;
			    case 1:
			      value = 3;
			      break;
			    case 2:
			      value = null;
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
      clickTabs(index) {
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
        if(init) {//初始化查询时重置list数组
          self.cardData.rows = []
        }
        let params = {
          userId: uni.getStorageSync("userInfo").userId,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          status: this.tabValue,
					examineesStatus:this.tabValue_,
        }
        this.$mainUtils.request("exames/exames/list", params, 'POST', res => {
          if (res) {
            self.cardData.rows.push(...res.rows) //拼接数组
            if(res.rows.length == 0 || res.rows.length < 10) { //加载后没有数据 或 返回的数据小于10条(已到末页) 显示为没有更多 并禁止再次加载
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
        uni.navigateTo({url: "/pages/exam/exam-detail?id="+item.examId});
        // this.showType = "detail"
      },
      /**
       * 滑动到页面底部 分页增加 并查询
       */
      scrollToLower(par) {
        if(this.loadingStatus != 'noMore')
         this.getExamList(false)
      }
    }
  }
</script>

<style scoped>
	.list-warp{
		/* background: #fff; */
	}
  .top-tabs {
    padding: 10px 0;
    border-bottom: 2upx solid #ece4e4;
		background: #fff;
  }
  .content-list {
    max-height: calc(100vh - 155px);
		width: calc(100% - 2upx);
		margin: 0 0upx;
  }
</style>
