<template>
  <view class=" backgroundFFF">
    <cmd-cell-item :title="detailData.periodTitle"></cmd-cell-item>
    <cmd-cell-item title="时长" :addon="periodHours(detailData.periodHours)"></cmd-cell-item>
    <cmd-cell-item title="积分" :addon="periodIntegral(detailData.periodIntegral)"></cmd-cell-item>
    <cmd-cell-item title="简介" addon="查看" arrow @click="goToIntro(detailData)"></cmd-cell-item> 
    <cmd-cell-item title="知识点" addon="查看" arrow @click="goToPointList(detailData)"></cmd-cell-item>
    <view>
      <uni-segmented-control class="segmented" :current="activeTab" :values="tabs" @clickItem="clickTabs" style-type="button" active-color="#ff6955" />
    </view>
    <!-- 相关习题 -->
    <view v-if="activeTab == 0">
    	<uni-card v-for="(item,index) in exercisesList" :title="`${index+1}. ${item.content}`" :key="index">
        <view v-for="(itemInner,indexInner) in item.answerList" :key="indexInner">
          <view :class="{'text-success': itemInner.exactness}">{{$mainUtils.returnAlpha(indexInner)}}. {{itemInner.content}} {{""}}<i v-if="itemInner.exactness" class="icon-check"></i> </view>
        </view>
        <view>
          解析: {{item.analysis}} 
        </view>
      </uni-card>
    </view>
    <!-- 问答 -->
    <scroll-view v-if="activeTab == 1" class="height-control" scroll-y="true">
      <view v-if="questionList.length > 0">
        <uni-card v-for="(item,index) in questionList" :thumbnail="item.picture" :title="item.creatorName" :note="`${item.dayNum == 0 ? '今天' : item.dayNum + '天前'}`" :key="index">
          <view>{{item.content}}</view>
          <hr class="line"> 
          <view class="marb2" v-for="(itemLa, indexLa) in  item.laList" :key="indexLa">
            {{ !indexLa ? '最新问答/创建人：' + itemLa.creatorName : '创建人：' + itemLa.creatorName }} 
            <view class="marl15">{{itemLa.content}}</view> 
          </view>
          <view calss="no-data-text">  
						<view class="marl20">{{item.answerNum}}回答/
							<span class="uni-color-ff6955" @click="checkMoreClick(index,item)">查看更多</span>
							 /<span class="uni-color-ff6955 " @click="addAnswer(index,item)">解答</span>  
							  <span class="uni-marl-10">{{item.browseNum}}浏览</span>
						</view> 
						<!-- <view class="marl20 fr">{{item.dayNum == 0 ? '今天' : item.dayNum + '天前'}}</view> -->
					</view>
        </uni-card>
      </view>
      <view v-else class="no-data-text"> 暂无问答 </view>
    </scroll-view>
    <!-- 评论 -->
    <scroll-view v-if="activeTab == 2" class="height-control" scroll-y="true">
      <view v-if="commentsList.length > 0">
        <uni-card
        v-for="item in commentsList"
				:key="item"
        :title="item.creator" 
        :thumbnail="item.picture" 
        :note="$mainUtils._convertDate(item.createTime, 'yyyy-MM-dd hh:mm')">
        {{item.commentContent}}
        </uni-card>
      </view>
      <view v-else class="no-data-text"> 暂无评论 </view>
    </scroll-view>
    <!-- 笔记 -->
    <scroll-view v-if="activeTab == 3" class="height-control" scroll-y="true">
      <view v-if="noteList.length > 0">
        <uni-card
        v-for="item in noteList"
				:key="item"
        :title="item.createName" 
        :thumbnail="item.createPicture" 
        :note="$mainUtils._convertDate(item.createTime, 'yyyy-MM-dd hh:mm')">
        {{item.content}}
        </uni-card>
      </view>
      <view v-else class="no-data-text"> 暂无评论 </view>
    </scroll-view>
    <view v-if="activeTab == 1 || activeTab == 2 || activeTab == 3" class="bottom-input">
      <input type="text" v-model="inputContent" placeholder="点击此处输入内容">
      <button @click="sendComment()" :disabled="!inputContent">发送</button>
    </view> 
		<neil-modal :show="showAnswerModel" title="解答" @cancel=" showAnswerModel = false " @confirm="saveAnswer()">
			<view class="input-view uni-media-list_plr">
				<view class="input-name">
					<view>内容</view>
					<input type="text" v-model="answerComment" placeholder="请输入内容" />
				</view> 
			</view>
		</neil-modal>
  </view>
</template>

<script>
	import neilModal from '@/components/neil-modal/neil-modal.vue';
  import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue'
  import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
  import uniCard from '@/components/uni-card/uni-card.vue'
  export default {
    components: { cmdCellItem, uniSegmentedControl, uniCard, neilModal},
    data() {
      return {
        detailData: {},
        optionId: null,
        tabs: ["相关习题", "问答", "评论", "笔记"],
        activeTab: 0,
        exercisesList: [], //相关习题
        questionList: [], //问答
        commentsList: [], //评论
        noteList: [], //笔记
        inputContent: "",
				showAnswerModel: false,
				answerComment:   '',
				lQuestionId: 		 null,
      }
    },
    onLoad(option) {
      this.optionId = option.id
      this.getDetail(option.id)
      this.getExercisesList(option.id)
      this.getQuestionList(option.id)
      this.getCommentsList(option.id)
      this.getNoteList(option.id)
    },
		computed: {
			periodHours() {
				return function (data) {
					return data + '小时';
				}
			},
			periodIntegral() {
				return function (data) {
					return data + '分';
				}
			}
		},
    methods: {
      /**
       * 获取当前课时详情
       */
      getDetail(id) {
        this.$mainUtils.request(`l_lecture/period/${id}`, null, 'GET', res => {
          if (res) {
            this.detailData = res
          }
        });
      },
      /**
       * 获取当前习题列表
       */
      getExercisesList(id) {
        let params = {
          id: id,
          pageNum:1,
          pageSize:999
        }
        this.$mainUtils.request(`l_lecture/question/list`, params, 'GET', res => {
          if (res) {
            this.exercisesList = res.rows
          }
        });
      },
      /**
       * 获取当前问答
       */
      getQuestionList(id) {
        let params = {
          periodId: id,
        }
        this.$mainUtils.request(`l_questions/l_questions/list`, params, 'GET', res => {
          if (res) {
            this.questionList = res
          }
        });
      },
      /**
       * 获取当前评论
       */
      getCommentsList(id) {
        let params = {
          fromId: id,
          fromType: 3
        }
        this.$mainUtils.request(`a_reviewes/list`, params, 'GET', res => {
          if (res) {
            this.commentsList = res.rows
          }
        });
      },
      /**
       * 获取当前评论
       */
      getNoteList(id) {
        let params = {
          periodId: id,
          type: 1
        }
        this.$mainUtils.request(`l_note/choice/list`, params, 'GET', res => {
          if (res) {
            this.noteList = res
          }
        });
      },
			 /*
       * 点击查看更多问答
       */
      checkMoreClick(index, itemData){ 
				this.$mainUtils.request(`l_questions/l_questions/details`,{id: itemData.id}, 'GET', res => { 
				  this.questionList[index].laList = res.laList; 
				}); 
      },
      /**
       * 发表评论 / 笔记
       */
      sendComment(id) {
        let self = this 
        if (self.activeTab == 1) {
          let parmas = {
            content: self.inputContent,
            periodId: self.detailData.periodId,
          } 
          self.$mainUtils.request(`l_questions/l_questions/add`, parmas, 'POST', res => {
            self.inputContent = ""
            this.getQuestionList(self.optionId)
          });
        }else if(self.activeTab == 2) {
          let parmas = {
            commentContent: self.inputContent,
            fromId: self.detailData.periodId,
            fromType: 3,
          } 
          self.$mainUtils.request(`a_reviewes/review`, parmas, 'POST', res => {
            self.inputContent = ""
            self.getCommentsList(self.optionId)
          });
        } else if (self.activeTab == 3) {
          let parmas = {
            content: self.inputContent,
            periodId: self.detailData.periodId,
          }
          
          self.$mainUtils.request(`l_note/l_note/add`, parmas, 'POST', res => {
            self.inputContent = ""
            self.getNoteList(self.optionId)
          });
        }
        
      },
      /**
       * 查看知识点列表
       */
      goToPointList(detailData) {
        uni.navigateTo({
        	url: `point?id=${detailData.periodId}`
        })
      },
      goToIntro(detailData) {
        uni.navigateTo({
        	url: `intro?id=${detailData.periodId}`
        })
      },
      /**
       * 点击顶部tabs 切换显示
       */
      clickTabs(index) {
        if (this.activeTab !== index) {
          this.activeTab = index;
        }
      },
			addAnswer(index,item){
				this.showAnswerModel = true;
				this.lQuestionId = item.id; 
			},
			saveAnswer(){
				if(!this.answerComment) 
				{
					uni.showToast({
						title:	'请填写内容',
						duration:		2000,
						mask:				true,
						icon:	'none',
					})  
					this.showAnswerModel = true;
					return false;
				}
				
				this.$mainUtils.request(`l_answers/l_answers/add`,{lQuestionId: this.lQuestionId, content: this.answerComment}, 'POST', res => { 
				  this.getQuestionList(this.optionId);
					this.answerComment = '';
					this.showAnswerModel = false;
				}); 
			}
    }
  }
</script>

<style lang="less">
  .text-success {
    color: #09BB07;
  }
  .height-control{
    height: calc(100vh - 850upx);
  }
  .bottom-input {
    position: absolute;
    bottom: 0;
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
