<template>
	<view class="backgroundFFF">
		<fl-signin 
			:date="date" 
			:list="list"  
			:repair="repair" 
			:rule="rule"  
			:choose_date="choose_date" 
			@date_change="date_change"
		></fl-signin>
		<button @click="checkBtn">签到</button>
	</view>
</template>
 
<script>
	import  flSignin from './fl-signin/fl-signin.vue'
	export default {
		components:{flSignin},
		data() {
			return {
				// 是否可以选择日期
				choose_date: true,
				// 当前日期
				date: new Date().Format('yyyy-MM') + '-01',
				// 签到成功列表
				list: ["2019-03-10", "03-15", "20"],
				// 是否开启补签
				repair: false,
				// 是否开启补签规则
				rule: false,
				checkStatus: false, //false为未签到， true 表示已经签到，
			}
		},
		mounted() {
			this.getCheckStatus();
			this.getQueryCalendar();
		},
		methods: {
			/* 查询打卡日历 */
			getQueryCalendar(){
				this.list = [];
				this.$mainUtils.request("hr_user_sign/list", {mouthDate: this.date}, "GET", res => {
					res.forEach( (item) => {
						if(item.id){
							this.list.push(this.$mainUtils._convertDate(item.createTime, 'yyyy-MM-dd'))
						}
					}); 
				}); 
			}, 
			// 当月份改变时触发
			date_change(date) {
				// 更新当前日期
				this.date = date; 
				this.getQueryCalendar();  
			},
			/**
       * 获取签到状态
       * @return {[type]} [description]
       */
      getCheckStatus () {
				this.$mainUtils.request("hr_user_sign/sign", '', "GET", res => {   
          if(!res) {
            this.checkStatus = false
          } else {
            this.checkStatus = res.sign;
          }
        }, (error, status) => {
          status == 200 ? this.$message.error(error.data.meta.message) :
                         this.$message.error("获取签到信息失败")
        })
      },
			checkBtn(){
				if(this.checkStatus){
					uni.showToast({
						title: '已签到',
						duration: 1000,
						icon: 'none',
						mask: true
					});
					return false;
				}
				this.$mainUtils.request("hr_user_sign/add", {mouthDate: this.date}, "POST", res => { 
          uni.showToast({
          	title: '签到成功',
          	duration: 1000,
          	icon: 'none',
          	mask: true
          });
					setTimeout( () => {
						this.getCheckStatus()
						this.getQueryCalendar();
					},1000)
				});
			},
		}
	}
</script>

<style>

</style>
