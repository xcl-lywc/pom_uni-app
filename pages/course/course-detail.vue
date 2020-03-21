<template>
  <view>
    <view class="top-wrap">
      <text class="top-title uni-font2">{{detailData.lectureTitle}} </text>
      <i @click="lectureLike" :class="detailData.isCollect ? 'icon-favorfill' : 'icon-favor'"></i>
      <img class="top-img" :src="detailData.lectureCovers" alt="图片">
    </view>
    <view class="detail-basic uni-font5 mart2">
      <text>创建者: {{detailData.creatorName}}</text>
      <text>上传时间: {{cttime(detailData.created, 'yyyy-MM-dd hh:mm')}}</text>
      <text><i class="icon-like" @click="dianZan"></i>{{detailData.lectureLike}}</text>
    </view>
    
    <view class="mart1">
      <uni-segmented-control class="segmented" :current="activeTab" :values="tabs" @clickItem="clickTabs" style-type="button" active-color="#ff6955" />
    </view> 
		<!-- 简介 -->
		<view v-if="activeTab == 0" class="">
			<view class="big-title-view uni-font1 mart15">
				<text class="title">简介</text> 
			</view>
			<view class="uni-list backgroundFFF"> 
				<view class="uni-list-cell mart1">
					<view class="uni-list-cell-navigate  uni-media-list ">
						<view class="uni-media-list-body">   
							<view class="subtitle mart20"> 
								<view class="text-justify uni-font3">
									{{detailData.periodIntroduction}}
								</view>
							</view>
							<view class="uni-font5 line-height1">讲师：{{detailData.lectureDocent}}</view>
						</view>
					</view>
				</view>
			</view> 
		</view> 
    <!-- 课时 -->
    <view v-if="activeTab == 1">
			<view class="big-title-view uni-font1 mart15">
				<text class="title">课时</text> 
			</view>
      <view class="backgroundFFF" v-if="detailData.lPeriodVoList.length > 0">
      	<cmd-cell-item :key="index" :title="item.periodTitle" v-for="(item, index) in detailData.lPeriodVoList" addon="查看" arrow @click="clickPeriod(item)"></cmd-cell-item>
      </view>
      <view v-else class="no-data-text"> 暂无数据 </view>
    </view>
    <!-- 知识点 -->
    <view v-if="activeTab == 2">
			<view class="big-title-view uni-font1 mart15">
				<text class="title">知识点</text> 
			</view>
      <view class="backgroundFFF">
				<cmd-cell-item :title="item.name"  v-for="(item, index) in detailData.knowList" :key="index"></cmd-cell-item>
			</view> 
    </view>
    <!-- 评论 -->
    <scroll-view v-if="activeTab == 3" class="height-control" scroll-y="true">
			<view class="big-title-view uni-font1 mart15">
				<text class="title">评论</text> 
			</view>
      <view class="uni-media-list_plr backgroundFFF" v-for="(item, index) in comments" :key="index">
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
    </scroll-view>
    <view v-if="activeTab == 3" class="  backgroundFFF">
      <view class="uni-flex uni-row backgroundFFF uni-media-list_plr bottom-input"> 
      	<input class="uni-input" @input="onKeyInput" :value="commentContent" placeholder="点击此处输入内容" />  
      	<uni-icon @click="sendComment" :disabled="!commentContent" type="paperplane" size="30"></uni-icon> 
      </view> 
    </view>
  </view>
</template>

<script>
	import uniIcon from "@/components/uni-icon/uni-icon.vue" 
  import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue'
  import uniCard from '@/components/uni-card/uni-card.vue'
  import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
  export default {
    components: { uniSegmentedControl, cmdCellItem, uniCard , uniIcon},
    data() {
      return {
        detailData: {
          lPeriodVoList: [],
          knowList: [],
        },
        optionId: null,
        
        comments: [], //评论
        commentContent: "", //发表评论的内容
        tabs: ['简介', '课时', '知识点', '评论'],
        activeTab: 0,
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
      this.optionId = option.id
      this.getDetail(option.id)
      this.getComments(option.id)
    },
    methods: {
      /**
       * 获取当前党课详情
       */
      getDetail(id) {
        this.$mainUtils.request("l_lecture/"+id+"/item", null, 'GET', res => {
          if (res) {
            this.detailData = res
          }
        });
      },
      /**
       * 获取评论
       */
      getComments(id) {
        let parmas = {
          id: id,
          status: 2,
          fromType: 3
        }
        this.$mainUtils.request("a_reviewes/list", parmas, 'GET', res => {
          if (res) {
            this.comments = res.rows
          }
        });
      },
      /**
       * 发表评论
       */
      sendComment(id) {
        let parmas = {
          commentContent: this.commentContent,
          fromId: this.detailData.lectureId,
          fromType: 3,
        }
        this.$mainUtils.request("a_reviewes/review", parmas, 'POST', res => {
					uni.showToast({
						title:	'评论成功，等待管理员审核。',
						duration:		2000,
						mask:				true,
						icon:	'none',
					})   
          this.commentContent = ""
					setTimeout(() => {
						this.getComments(this.detailData.lectureId)
					},2500)
          
        });
      },
      /**
       * 点击顶部tabs 切换显示
       */
      clickTabs(index) {
        if (this.activeTab !== index) {
          this.activeTab = index;
        }
      },
      /**
       * 点击课时 进入详情
       */
      clickPeriod(item) {
        uni.navigateTo({
        	url: "/pages/course/course-components/period?id="+item.periodId
        })
      },
			/* 输入内容 */
			onKeyInput(val){ 
				this.commentContent = val.detail.value;
			}, 
			/* 收藏 */
			lectureLike(){  
				this.$mainUtils.request('a_collection/'+ this.optionId +'/2/collect/toggle', '', 'POST', res => {
				  this.getDetail(this.optionId);
				});
			},
			/* 点赞 */
			dianZan(){  
				this.$mainUtils.request('l_lecture/'+ this.optionId +'/toggle/like', '', 'POST', res => {
				  this.getDetail(this.optionId);
				});
			}
    }
  }
</script>

<style lang="less">
  
  .top-wrap {
    height: 450upx;
    .top-title {
      position: absolute;
      display: inline-block;
      width: calc( 100vw - 65upx);
      height: 80upx;      
      line-height: 80upx;
      background: #27272761;
      color: #fff;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .icon-favor, .icon-favorfill{
      position: absolute;
      height: 80upx; 
      right: 0;
      padding: 0 20upx 0 0;
      color: #fff;
      font-size: 45upx;
      background: #27272761;
    }
    .top-img {
      width: 100%;
      height: 100%;
    }
  }
  
  
  
  .detail-basic {
    display: flex;
    justify-content: space-around;
    
  }
  .height-control {
    height: calc(100vh - 755upx);
    overflow: auto;
  }
  .bottom-comment {
    display: flex;
    justify-content: space-between;
    align-content: center;
    background: #ececec;
    border-top: 2upx solid #ececec;
    uni-input {
      display: inline-block;
      width: calc(70vw - 20upx);
      padding: 20upx;
      background: #fff;
    }
    uni-button {
      display: inline-block;
      width: calc(29vw - 40upx);
      margin: 0;
    }
  }
</style>
