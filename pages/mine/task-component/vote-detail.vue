<template>
	<view v-if="detail">
		<cmd-cell-item  title="选票题目" :addon="detail.ballotSpecial" ></cmd-cell-item>
		<cmd-cell-item  title="选票详情" :addon="detail.ballotRequire" ></cmd-cell-item> 
		<uni-card title="选题内容">
			<view v-if="detail.hasOwnProperty('questions')">
        <view v-for="(item, index) in detail.questions" :key="index">
          <view class="mart5">{{index+1}}. {{item.questionName}}</view>
					<radio-group v-if=" item.type == 0 ">
							<label class="uni-list-cell uni-list-cell-pd uni-list-cell-self" v-for="(itemOpt, indexOpt) in item.options" :key="indexOpt">
									<view>
											<radio value="15" disabled/>
									</view>
									<view>{{itemOpt.optionName}}</view>
							</label>
					</radio-group>
					<checkbox-group v-if=" item.type == 1 ">
						<label class="uni-list-cell uni-list-cell-pd uni-list-cell-self" v-for="(itemOpt, indexOpt) in item.options" :key="indexOpt">
								<view>
										<checkbox value="15" disabled/>
								</view>
								<view>{{itemOpt.optionName}}</view>
						</label> 
					</checkbox-group>
        </view>
      </view>
		</uni-card>
	</view>
</template>

<script>
	import cmdCellItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	import uniCard from "@/components/uni-card/uni-card.vue"
	export default {
		components:{ cmdCellItem ,uniCard},
		data() {
			return {
				detail: null,
			}
		},
		onLoad(option){
			this.getQueryDetail(option.voteId)
		},
		methods: {
			/*
       * 查询详情
       */
      getQueryDetail(voteId){ 
				this.$mainUtils.request("/v_ballot/detail/"+voteId+"/from_org/"+uni.getStorageSync('userInfo').orgCode, '', "GET", (res) => {
					this.detail = res; 
				}); 
      },
		}
	}
</script>

<style>
	.uni-list-cell-self{
		justify-content: end;
	}
</style>
