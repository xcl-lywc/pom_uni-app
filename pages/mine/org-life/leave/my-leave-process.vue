<template>
  <view>
		<view v-if="total !==0" class="detail-card">
				<uni-steps :data="data" 
						direction="column" 
						:active="data.length-1">
				</uni-steps>
		</view>
		<view v-else class="no-data">暂无数据</view>
  </view>
</template>

<script>
  import '@/static/css/uni.css'
	import uniSteps from "@/components/uni-steps/uni-leave-steps.vue"
  import uniCard from "@/components/uni-card/uni-card.vue"
  export default {
    components: {uniCard,uniSteps},
    data() {
      return {
				data:[],
				total:0,
      };
    },
		onLoad(option) {
		  this.getProcess(option.taskId)
		},
    methods: {
      /* 
      * 获取流程
      *  */
      getProcess(taskId){
				var self = this;
      	self.$mainUtils.request("t_tasks/review/list", {fromId:taskId,fromType:'2',status:2}, "GET", (res) => {
					
					if (res && res.rows) {
						var rows = res.rows;
						self.data = [];
						for (var item in rows) {
							var obj = {
								title: rows[item].commentContent,
								desc: rows[item].creator,
								time:this.$mainUtils._convertDate(rows[item].createTime, 'yyyy-MM-dd hh:mm')
							}
							self.data.push(obj);
						}
						
						self.total = res.total;
					} else {
						self.data = [];
						self.total = 0;
					}
      	});
      },
    }
  }
</script>

<style lang="scss">
	.no-data{
		text-align: center;
		padding: 40upx 0;
		background-color: white;
	}
  .detail-card{
		background: #fff;
		.uni-card{
			box-shadow: none;
			padding: 0 20upx;
		}
	}
</style>
