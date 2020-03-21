<template>
  <view>
		<view v-if="detail" class="detail-card">
			<uni-card 
				is-full="true" 
				:title="detail.lifeName"
				:note="'创建人：'+detail.creator+' '+'创建时间：'+ctime(detail.createTime, 'yyyy-MM-dd hh:mm')">
				<view  v-html="detail.lifeContent"></view>
			</uni-card>
		</view>
  </view>
</template>

<script>
  import '@/static/css/uni.css'
  import uniCard from "@/components/uni-card/uni-card.vue"
  export default {
    components: {uniCard},
    data() {
      return {
        detail:null,
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
		onLoad(option) {
		  this.getDetail(option.id)
		},
    methods: {
      /* 
      * 获取详情
      *  */
      getDetail(id){
      	this.$mainUtils.request("party_member_infos/orglift/"+id, '', "GET", (res) => {
      		this.detail = res;
      	});
      },
    }
  }
</script>

<style lang="scss">
  .detail-card{
		.uni-card{
			box-shadow: none;
			padding: 0 20upx;
		}
	}
</style>
