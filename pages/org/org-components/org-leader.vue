<template>
	<view class="org-leader" v-if="getOrgLeader">
		<view v-if="getOrgLeader.length!=0">
			<view class="leader-item" v-for="(item,index) in getOrgLeader" :key="index">
				<view class="overflow-hidden">
					<view class="leader-item-title leader-item-left">{{_convertTable(comparisonTable, item.positionName,(getType===2?7:6))}}</view>
					<view class="leader-item-arrow leader-item-right"></view>
					<view class="leader-item-content leader-item-right">{{item.name?item.name:'暂无'}}</view>
				</view>
				<view class="overflow-hidden mart2">
					<image v-if="item.picture" class="leader-item-image leader-item-left" style="width: 100px; height: 100px;" mode="scaleToFill" :src="item.picture"></image>
					<view v-if="!item.picture"  class="leader-item-image leader-item-left" style="width: 100px; height: 100px;">暂无图片</view>
					<view class="leader-item-info leader-item-left">
						{{item.description?item.description:'暂无'}}
					</view>
				</view>
			</view>
		</view>
		<view v-else class="no-data">暂无数据</view>
	</view>
	
</template>

<script>
	export default {
		props:['orgLeader','type'],
		data() {
			return {
				comparisonTable:[],
			}
		},
		computed:{
			getOrgLeader(){
				return this.orgLeader
			},
			getType(){
				return this.type
			},
		},
		mounted() {
			this.getComparisonTable();
		},
		methods: {
			
			/*
			 * 对照表转化 党组织和公司职位
			 */
			_convertTable(table, code,index){
				let val = '';
				let positionTable = table[index]
				if(positionTable){
					if(positionTable.list.length!=0){
						for(var i = 0;i<positionTable.list.length;i++){
							if(positionTable.list[i].key === Number(positionTable.list[i].code)){
								if(positionTable.list[i].code === code){
									val = positionTable.list[i].value;
								}
							}else{
								if(positionTable.list[i].key === Number(code)){
									val = positionTable.list[i].value;
								}
							}
						}
					}else{
						val = '暂无';
					}
				}
				
				
				return val;
			},
			
			/* 
			* 获取对照表 
			* */
			getComparisonTable(){
				if(this.getType===1||this.getType===2){
					this.$mainUtils.request("contrast/all_contrast_info",'', "GET", (res) => {
						this.comparisonTable = res;
					});
				}
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
	.overflow-hidden{
		overflow: hidden;
	}
	.org-leader{
		background-color: #fff;
		overflow: hidden;
		width: 100%;
		font-size: 30upx;
		.leader-item{
			overflow: hidden;
			border-bottom: 1upx solid #ece4e4;
			margin: 0 30upx;
			padding:20upx 0upx;
			.leader-item-left{
				float: left;
				font-size: 32upx;
			}
			.leader-item-right{
				float: right
			}
			.org-leader-image{
				width: 200upx;
				border-radius: 10upx;
			}
			.leader-item-info{
				width: calc(100% - 220upx);
				margin-left: 20upx;
				line-height: 45upx;
				color: #858B9C;
				font-size: 28upx;
				padding-right: 10upx;
				box-sizing: border-box;
			}
			.leader-item-title{
				// padding: 0 0 10upx 0;
			}
			.leader-item-arrow{
				display: inline-block;
				width: 16upx;
				height: 16upx;
				border: 3upx solid #a3a3a3;
				border-left-width:0; 
				border-bottom-width: 0;
				transform: rotate(45deg);
				margin-left: 12upx;
				margin-right: 12upx;
				margin-top: 16upx;
			}
		}
	}
</style>
