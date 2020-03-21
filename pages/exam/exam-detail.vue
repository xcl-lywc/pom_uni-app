<template>
  <view class="uni-pad-30 backgroundFFF" style="height: calc(100vh - 148upx);">
    <!-- <text class="title-text">{{detailData.testPaper.theme}}</text> -->
    
		<cmd-cell-item :title="detailData.testPaper.theme" maxtitle></cmd-cell-item>
    <cmd-cell-item title="答题要求" :brief="paperDetailData.requirement" arrow @click="clickItem('requirement')" isEllipsis mart="-30px"></cmd-cell-item>
		<cmd-cell-item title="考题组成" :brief_="paperDetailData.questionCount" arrow :addon="'总分：'+ paperDetailData.totalScore +'分'" mart="-60px"></cmd-cell-item>
		<!-- <view class="exam-cell-item  uni-padt-20 uni-padb-20">
		  <view class="text-right  uni-font-32">总分: {{ paperDetailData.totalScore }}分</view>
		  <view class="around-text uni-padt-10">
		    
		  </view>
		</view> -->
		<cmd-cell-item title="考察知识点"  arrow @click="clickItem('point')"></cmd-cell-item>
		<!-- 
		* 未考+待考试或进行中<=>进入试题页面；
		* 未考+考试已结束<=>进入解析页面；
		* 已考<=>进入解析页面；
		*  -->
		<cmd-cell-item v-if="detailData.isExame" title="试题内容" :addon="detailData.status == 3 ?'开始答题' : '已结束'" arrow @click="clickItem(detailData.status == 3 ?'exam':'analysis')"></cmd-cell-item>
		<cmd-cell-item v-if="!detailData.isExame" title="试题内容" :addon="'已考'" arrow @click="clickItem('analysis')"></cmd-cell-item>
		<!-- <cmd-cell-item title="考试时间" :brief="`${ctime(detailData.beginTime, 'yyyy-MM-dd hh:mm')} 至 ${ctime(detailData.endTime, 'yyyy-MM-dd hh:mm')}`"></cmd-cell-item> -->
    <!-- <cmd-cell-item title="考试限时" brief="限时1小时, 中途退出页面依旧计时"></cmd-cell-item> -->
  </view>
</template>

<script>
  import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue'
  export default {
    components: { 
      cmdCellItem
    },
    data() {
      return {
        testId: null,
        paperId: null,
        detailData: { //本次考试详情
          testPaper: {},
        },
        paperDetailData: { // 本次考试对应试卷的详情
          tptList: [],
          questionCount: []
        },
      }
    },
    onLoad(option) {
			// detailData
      this.testId = option.id
      this.getDetail(option.id)
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
    methods: {
      /**
       * 查询考试详情(考试的基本信息)
       */
      getDetail(id) {
        this.$mainUtils.request("exames/exames/details", {id: id}, 'GET', res => {
          if (res) {
            this.detailData = res;
            this.paperId = res.testPaper.id;
            this.getPaperDetail(res.testPaper.id);
						//动态设置顶部导航title
						// uni.setNavigationBarTitle({
						// 		title: res.testPaper.theme
						// });
          }
        });
      },
      /**
       * 查询本次考试的试卷 详情
       */
      getPaperDetail(id) {
        this.$mainUtils.request("test_papers/test_papers/details", {id: id}, 'GET', res => {
          if (res) {
            this.paperDetailData = res
          }
        });
      },
      /**
       * 点击对应的list内容 跳转至不同的页面
       */
      clickItem(type) {
        let target= null
        switch(type) {
          case "requirement":
            target = "/pages/exam/exam-components/requirement?id="+this.paperId;
            break;
          case "point":
            target = "/pages/exam/exam-components/point?id="+this.paperId;
            break;
          case "start":
            target = "/pages/exam/exam-components/start-testing?testId="+this.testId+"&paperId="+this.paperId;
            break;
					case "analysis":
					  target = "/pages/exam/exam-components/start-testing?testId="+this.testId+"&paperId="+this.paperId+"&type=analysis";
					  break;
					case "exam":
					  target = "/pages/exam/exam-components/start-testing?testId="+this.testId+"&paperId="+this.paperId+"&type=exam";
					  break;
          default:
            target = "/pages/exam/exam-components/requirement?id="+this.paperId
            break;
        }
        uni.navigateTo({url: target})
      }
    }
  }
</script>

<style scoped>
  .title-text {
    font-size: 36upx;
  }
  .around-text {
    display: flex;
    justify-content: space-between;
  }
	.exam-cell-item{
		border-bottom: 1upx solid #f4f5f7;
		font-size: 32upx !important;
		margin: 0 30upx;
	}
</style>
