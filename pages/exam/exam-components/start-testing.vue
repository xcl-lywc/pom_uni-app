<template>
  <view class="uni-pad-30 backgroundFFF" style="height: calc(100vh - 148upx);">
    <i class="icon-check finish" @click="finishTest" v-if="options.type==='exam'"></i>
    <view class="info-head">
      <text><text> 已答{{answeredQuestion}}题</text>；共{{detailData.eqList.length}}题</text>
      <text> </text>
    </view>
    <view class="main-content" style="width: calc(100% - 2upx);">
      <!-- <uni-card v-if="!!currentQuestion.answerList" :title="questionTitle" :isFull="true">
        <text>{{currentQuestion.content}}</text>
      </uni-card> -->
			<view v-if="!!currentQuestion.answerList">
				<view class="uni-font-32">{{questionTitle}}</view>
				<view class="uni-font-28_ uni-padt-10 uni-padb-20 uni-marb-20 border-b-1">{{currentQuestion.content}}</view>
			</view>
      <!-- <view v-for="(item, index) in currentQuestion.answerList">{{item.content}}</view> -->
      <view class="uni-list" v-if='currentQuestion.answerList.length>0'>
        <!-- 单选 -->
        <radio-group v-if="currentQuestion.type == 1" @change="radioChange">
          <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in currentQuestion.answerList" :key="item.id">
            <view>
              <!-- content中的值匹配后 设为选中 || 点击后选中 --> 
              <radio :disabled="!!currentQuestion.examinContent||options.type==='analysis'" :value="String(item.id)" :checked="currentQuestion.examinContent == item.id || index == currentRadio" />
            </view>
            <view>{{item.content}}</view>
          </label>
        </radio-group>
        <!-- 多选 -->
        <checkbox-group v-if="currentQuestion.type == 2" @change="checkboxChange">
          <label class="uni-list-cell uni-list-cell-pd" v-for="item in currentQuestion.answerList" :key="item.id">
            <view>
              <!-- content中的值匹配后 设为选中 || 点击后选中 --> 
              <checkbox :checked="returnChecked(item)" :disabled="!!currentQuestion.examinContent||options.type==='analysis'" :value="String(item.id)"/>
            </view>
            <view>{{item.content}}</view>
          </label>
        </checkbox-group>
        <!-- <view> {{detailData}}</view> -->
      </view>
			
			<view v-if="options.type==='analysis'">
				<view class="q-answer">
					<view class="top">
						<view class="uni-font-32 fl">习题答案</view>
						<image src="../../../static/images/to.png" class="fr right-arrow"></image>
						<view class="uni-font-28 fr answer-content"><text v-for="item in questions.answer">{{item+' '}}</text></view>
					</view>
					<view class="bottom"><text class="uni-font-28">解析：</text><text class="uni-font-28">{{questions.analysis?questions.analysis:'无解析'}}</text></view>
				</view>
				<view class="q-your_answer">
					<view class="uni-font-32 fl">你的答案</view>
					<view class="uni-font-28 fr answer-content"><text v-for="item in questions.your_answer">{{item+' '}}</text></view>
				</view>
			</view>
      
      
      <!-- <view class="select-area">
        <picker v-if="indexArray.length > 0" :value="currentIndex" :range="indexArray" range-key="title" @change="pickerChange">
          <view class="select-box">
            <text>{{ indexArray[currentIndex].title }} <i class="icon-triangledownfill"></i></text>
            <text class="select-icon"></text>
          </view>
        </picker>
      </view> -->
      
      <!-- <glance ref="glance" @clickKeyword="clickIndex" :data="indexArray" :showProps="showProps" :activeIndex="0"></glance> -->
      <view class="bottom-button" :style="{'bottom': indexArray.length > 0 ? '101upx' : '0'}">
        <view class="button-flex">
          <button :disabled="currentIndex == 0" @click="changeCurrentQuestion('pre')"  size="mini">上一题</button>
          <button v-if="options.type==='exam'" :disabled="!!currentQuestion.examinContent" @click="finishSingle" type="primary" size="mini"> {{ !currentQuestion.examinContent ? '提交本题' : '本题已答'}}</button>
          <button :disabled="currentIndex >= detailData.eqList.length - 1" @click="changeCurrentQuestion('next')"  size="mini">下一题</button>
        </view>
      </view>
    </view>
		<view class="tabs-area" v-if="indexArray.length > 0" >
			<wuc-tab :tab-list="indexArray" :tabCur.sync="currentIndex" @change="tabChange"></wuc-tab>
		</view>
  </view>
</template>

<script>
  import uniCard from "@/components/uni-card/uni-card.vue"
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue'
  export default {
    components: {
      uniCard,
			WucTab,
			cmdCellItem
    },
    data() {
      return {
				userinfo: uni.getStorageSync('userInfo'),
        options: {},
        orgCode: uni.getStorageSync("userInfo").orgCode,
        
        detailData: { //本次考试的详情
          "questMapList": {
            "1": [],
            "2": [],
            "3": []
          },
          "eqList": []
        },
        indexArray: [], //题目索引
        showProps: {
          label: 'title',
          keyId: 'value',
        },
        currentIndex:    0, // 当前操作的题目index
        currentQuestion: {  // 当前操作的题目
          type: 0,
          answerList: [],
          examinContent: "" //当前题目的作答结果(是已经提交的结果)
        },
				questions:{//当前题目的答案与解析
					analysis:'',
					answer:[],
					your_answer:[],
				},
        currentRadio: null, // 当前题目 对应用户的作答(切换题目或者提交后需要还原)
        currentCheckbox: [], // 当前题目 对应用户的作答(切换题目或者提交后需要还原)
      }
    },
    onLoad(option) {
      window.test = this
      this.options = option
			let type = option ? option.type : '';
			type === "analysis" ? uni.setNavigationBarTitle({title: '试题解析'}) : '';
      this.getPaperDetail(parseInt(option.testId), 0,type)
    },
    watch: {
      "currentIndex": {
        handler(newV, oldV) {
          this.currentRadio = null
          this.currentCheckbox = []
        },
        deep: true,
      }
    },
    computed: {
      questionTitle() {
        switch(this.currentQuestion.type) {
          case 1:
            return "单选题";
          case 2:
            return "多选题";
          case 3:
            return "简答题";
           default:
            return "题目加载错误"
        }
      },
      answeredQuestion() { //已答过的题目
        var count = 0
        this.detailData.eqList.forEach(item => {
          if(item.examinContent) {
            count++
          }
        })
        return count
      }
    },
    methods: {
			/**
			 * @name 改变tab
			 * @param val 索引
			 * 点击目录 跳转题目
			 */
			tabChange(val) {
				console.log(val)
				this.currentIndex = val
				this.currentQuestion = JSON.parse(JSON.stringify(this.detailData.eqList[val]))
				
				//解析 正确答案 你的答案
				this.currentQuestion.id ? this.question(this.currentQuestion.id,this.currentQuestion.examinContent) : '';
			},
      /**
       * 查询本次考试的详情 并根据需要的Index值将对应题目设为选中 
       * 如果已经答过本题 需要将examinContent的值读取并写入 同时禁用本题的相关操作
       * id: 查询对应的详情(试卷 答题情况)
       * index: 当前需要展示的题目Index
       */
      getPaperDetail(id, index,type) {
        let params = {
          id: id,
          formData:   1,
          taskId:     1,
          instanceId: 1, 
        }
				let params_ = {
					id:null
				}
				if( type=='analysis'){
					var pageNum = 0;
					if(!params_.id){
						pageNum++;
						this.$mainUtils.request("examinees/examinees/list", {examId:this.options.testId,status:3,pageNum:pageNum,pageSize:10}, 'GET', res => {
						  if (res) {
								res.rows.forEach( (item) => {
									item.userId = this.userinfo.userId ? params_.id = item.id : params_.id = null;
								}) 
								
								this.$mainUtils.request("examinees/examinees/details", params_, 'GET', res => {
								  if (res) {
								    this.detailData = res
								    this.currentQuestion = JSON.parse(JSON.stringify(res.eqList[index]))
								    this.indexArray = res.eqList.map((item, index) => { //创建题目索引数组
								      return {
								        title: "第"+(index+1)+"题",
								        value: index,
								      }
								    })
										
										//解析 正确答案 你的答案
										this.currentQuestion.id ? this.question(this.currentQuestion.id,this.currentQuestion.examinContent) : '';
								  } else {
								    setTimeout(_ => {
								      uni.navigateBack();
								    }, 2000)
								  }
								});
								
						  } 
						});
					}
				}   
				 
        if(type=='exam'){
					this.$mainUtils.request("examinees/join/update/from_org/"+this.orgCode, params, 'POST', res => {
					  if (res) {
					    this.detailData = res
					    this.currentQuestion = JSON.parse(JSON.stringify(res.eqList[index]))
					    this.indexArray = res.eqList.map((item, index) => { //创建题目索引数组
					      return {
					        title: "第"+(index+1)+"题",
					        value: index,
					      }
					    })
					  } else {
					    setTimeout(_ => {
					      uni.navigateBack();
					    }, 2000)
					  }
					});
				}
      },
			question(id,data){
				this.questions.answer = [];
				this.questions.your_answer = [];
				this.$mainUtils.request("/questions/questions/details", { id: id} , 'GET', res => {
				  if (res) {
						this.questions.analysis = res.analysis;//解析
						res.answerList.forEach( (item) => { 
							item.exactness ? this.questions.answer.push(item.content) : '';//正确答案
							
							if(data){
								if(data.indexOf(',')===-1){
									Number(data) === item.id ? this.questions.your_answer.push(item.content) : '';//你的答案
								}else{
									let newarr =  data.split(',');
									console.log(newarr)
									newarr.forEach((childItem) =>{
										Number(childItem) === item.id ? this.questions.your_answer.push(item.content) : '';//你的答案
									})
								}
							}
							
						})  
						if(!data){this.questions.your_answer.push('未做答') ;}//你的答案
				  }
				});
			},
			
      /**
       * 点击右上角 结束考试
       */
      finishTest() {
        let self = this
				if(self.detailData.id === undefined){return;}
        let config = {
          id:         self.detailData.id,
          formData:   1,
          taskId:     1,
          instanceId: 1,
        }
        
        self.$mainUtils.request("examinees/end/update/from_org/"+self.orgCode, config, 'POST', 
          (response) => {
            uni.showToast({
              title: '本次考试结束!',
              duration: 1000,
              mask: true,
              icon: 'none',
            })
            uni.navigateBack();
          }
        )
      },
      /**
       * 点击目录 跳转题目
       */
      pickerChange(e) {
				console.log(e.detail.value)
        this.currentIndex = e.detail.value
        this.currentQuestion = JSON.parse(JSON.stringify(this.detailData.eqList[e.detail.value]))
      },
      
      /**
       * 切换题目 pre上一题 next下一题
       */
      changeCurrentQuestion(type) {
        if(type == 'pre') {
          this.currentQuestion = JSON.parse(JSON.stringify(this.detailData.eqList[--this.currentIndex]))
					//解析 正确答案 你的答案
					this.currentQuestion.id ? this.question(this.currentQuestion.id,this.currentQuestion.examinContent) : '';
        } else {
          this.currentQuestion = JSON.parse(JSON.stringify(this.detailData.eqList[++this.currentIndex]))
					//解析 正确答案 你的答案
					this.currentQuestion.id ? this.question(this.currentQuestion.id,this.currentQuestion.examinContent) : '';
        }
      },
      /**
       * 点击下方 提交当前题目 
       */
      finishSingle() {
        var self = this
        var params = {
          content: null,
          questionId: self.currentQuestion.id,
          examineeId: self.detailData.id,
        }
        // 根据类型进行不同的内容提交
        switch(self.currentQuestion.type) {
          case 1:
            params.content = self.currentRadio
            break;
          case 2:
            params.content = self.currentCheckbox.join(",")
            break;
          case 3:
            params.content = self.currentInput
            break;
        }
        //在单选多选均为空时 不进行操作
        if(!!this.currentRadio || this.currentCheckbox.length > 0) {
          uni.showModal({
            title: '确认提交并进入下一题?',
            content: '提交本题后, 无法再次修改',
            success: function (res) {
              if (res.confirm) {
                self.$mainUtils.request("examinee_answers/examinee_answers/update/"+self.currentQuestion.examinAnsId, params, 'POST', res => {
                  if(self.currentIndex < self.detailData.eqList.length - 1) { // 重新查询 未处于最后一题时加载至下一题
                    self.getPaperDetail(self.options.testId, ++self.currentIndex,'exam') 
                  } else { // 在末尾时查询当前题目
                    self.getPaperDetail(self.options.testId, self.currentIndex,'exam')
                  }
                });
              }
            }
          });
        } else {
          uni.showToast({
            title: '请选择答案!',
            duration: 1000,
            mask: false,
            icon: 'none',
          })
        }
      },
      /**
       * 点击不同的单选 保存当前选中的内容
       */
      radioChange(evt) {
        for (let i = 0; i < this.currentQuestion.answerList.length; i++) {
          if (this.currentQuestion.answerList[i].id == evt.target.value) {
            this.currentRadio = this.currentQuestion.answerList[i].id;
            break;
          }
        }
      },
      /**
       * 判断当前checkbox是否选中(只适用于本题已答过的情况)
       */
      returnChecked(checkItem) {
        var flag = false
        if(this.currentQuestion.examinContent){
          var array = this.currentQuestion.examinContent.split(",")
          array.forEach(item => {
            if (checkItem.id == item) {
              flag = true
            }
          })
        }
        return flag
      },
      checkboxChange: function (e) {
        this.currentCheckbox = e.target.value
      }
    }
  }
</script>

<style lang="less">
  .finish {
    position: fixed;
    z-index: 999;
    top: 0;
    right: 20upx;
    color: #fff;
    font-size: 45upx;
  }
  .info-head {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
  }
  .main-content {
    height: calc(100vh - 128px - 150upx);
    overflow: auto;
  }
  
  .select-area {
    position: fixed;
    display: block;
    width: calc( 100% - 40upx );
    height: 80upx;
    bottom: 140upx;
    border-top: 2upx solid #ececec;
    box-sizing: border-box;
    .select-box {
      height: 80upx;
      line-height: 80upx;
      text-align: center;
      .icon-triangledownfill {
        font-size: 40upx;
      }
    }
  }
  
  .bottom-button {
    position: fixed;
    bottom: 101upx;
    padding: 0upx 0 20upx 0;
    width: calc( 100% - 40upx );
    .button-flex {
      display: flex;
      justify-content: space-between;
      uni-button {
        margin: 0 20upx!important;
      }
    }
  }
	
	.tabs-area{
		position: fixed;
		bottom: 0;
		background: #fff;
		width: calc(100% - 60upx);
		border-top: 1upx solid #f2f2f2;
	}
	
	.q-answer{
		padding: 20upx 0;
		border-bottom: 1upx solid #e4e3e6;
		.top{
			width: 100%;
			overflow: hidden;
			.right-arrow{
				width: 8%;
				flex-shrink:0;
				width:36upx;
				height:32upx;
				margin-top: 12upx;
			}
			// .answer-content{
			// 	display: inline-block;
			// 	white-space: nowrap;
			// 	width: calc(92% - 100px);
			// 	overflow: hidden;
			// 	text-overflow: ellipsis;
			// }
		}
		.bottom{
			width: 100%;
		}
	}
	
	.q-your_answer{
		overflow: hidden;
		padding: 20upx 0;
		border-bottom: 1upx solid #e4e3e6;
		// .answer-content{
		// 	display: inline-block;
		// 	white-space: nowrap;
		// 	width: calc(92% - 100px);
		// 	overflow: hidden;
		// 	text-overflow: ellipsis;
		// }
	}
  
  
</style>
