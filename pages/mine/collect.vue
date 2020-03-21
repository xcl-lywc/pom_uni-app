<template>
  <view class="top-tabs-wrap">
    <view class="top-tabs">
      <uni-segmented-control class="segmented" :current="activeTab" :values="tabs" @clickItem="onClickItem" style-type="button" active-color="#ff6955" />
    </view>
		
    <scroll-view @scrolltolower="scrollToLower" class="content-list" scroll-y="true">
      <view v-if="activeTab===0">
				<uni-list>
					<view v-for="(item, index) in cardData.rows" :key='index'>
						<uni-list-item :title="item.articleName" 
						  show-extra-icon="true" 
						  :extra-icon="{color: '#F44336',size: '22',type: 'star-filled'}"
							@click="listClicked(item)"
							:note="'作者：'+item.author+' 时间：'+ctime(item.collectTime, 'yyyy-MM-dd')">
						</uni-list-item>
					</view>
					<uni-load-more :status="loadingStatus"></uni-load-more>
				</uni-list>
			</view>
			<view v-if="activeTab===1">
				<course :isCollect="true"></course>
			</view>
      
    </scroll-view>
  </view>
</template>

<script>
  import '@/static/css/uni.css'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
  import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import course from "../course/course.vue"
  import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
  export default {
		components: {uniSegmentedControl, uniLoadMore,course,uniList,uniListItem},
    data() {
      return {
				userInfo:uni.getStorageSync("userInfo"),
        tabs: ['首页收藏', '党课收藏'],
        activeTab: 0,
        cardData: {rows: [],total: 0},
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
			}
		},
    mounted() {
      this.getList(true)
    },
    methods: {
      /**
       * 点击顶部tabs
       */
      onClickItem(index) {
				this.activeTab = index;
        if (index===0) {
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
        if(init) {//初始化查询时重置list数组
          self.cardData.rows = []
        }
        let params = {
          type:'',
          pageNum: this.currentPage,
          pageSize: this.pageSize,
        }
        this.$mainUtils.request("a_info/collect/list/from_org/"+this.userInfo.partyOrgCode, params, 'GET', res => {
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
       * 点击list 跳转至详情 之前的所有内容将保留
       */
      listClicked(item) {
        uni.navigateTo({url: "/pages/index/news-detail?newsId="+item.id})
      },
      /**
       * 滑动到页面底部 分页增加 并查询
       */
      scrollToLower(par) {
        if(this.loadingStatus != 'noMore')
         this.getList(false)
      }
    }
  }
</script>

<style scoped lang="scss">
	.top-tabs-wrap{
		// background: #fff;
	}
  .top-tabs {
    padding: 20upx 0;
    border-bottom: 2upx solid #ece4e4;
		background: #fff;
  }
  .content-list {
    max-height: calc(100vh - 194upx);
  }
</style>
