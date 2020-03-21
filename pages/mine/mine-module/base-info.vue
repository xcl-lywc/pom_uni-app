<template>
	<view class="base-info-wrap">
		<view class="base-info" v-if="myInfo">
			<view class="list list-h160" @click="skipBaseInfo(myInfo.picture,'picture')">
				<text class="text-title">头像</text>
				<view class="table-box">
					<view class="img-box">
						<image v-if="myInfo.picture" :src="myInfo.picture" class="head-img"></image>
						<text v-else style="color: #666;" >暂无</text>
					</view>
				</view>
				<image src="../../../static/images/to.png" class="right-arrow right-arrow-mart58"></image>
			</view>
			<view class="list list-h100">
				<text class="text-title">账号</text>
				<text class="text-content">{{myInfo.account?myInfo.account:'暂无'}}</text>
				<image src="../../../static/images/to.png" class="right-arrow right-arrow-mart28" v-show='false'></image>
			</view>
			<view class="list list-h100" @click="skipBaseInfo(myInfo.name,'name')">
				<text class="text-title">姓名</text>
				<text class="text-content">{{myInfo.name?myInfo.name:'暂无'}}</text>
				<image src="../../../static/images/to.png" class="right-arrow right-arrow-mart28"></image>
			</view>
			<view class="list list-h100" @click="skipBaseInfo(myInfo.sex,'sex')">
				<text class="text-title">性别</text>
				<text class="text-content">{{computed_convertTable(comparisonTable, myInfo.sex,0)}}</text>
				<image src="../../../static/images/to.png" class="right-arrow right-arrow-mart28"></image>
			</view>
			<view class="list list-h100" @click="skipBaseInfo(myInfo.borthday.date_time,'borthday')">
				<text class="text-title">生日</text>
				<text class="text-content">{{myInfo.borthday ? ctime(myInfo.borthday.date_time,'yyyy-MM-dd') : '暂无'}}</text>
				<image src="../../../static/images/to.png" class="right-arrow right-arrow-mart28"></image>
			</view>
			<view class="list list-h100" @click="skipBaseInfo(myInfo.address,'address')">
				<text class="text-title">地址</text>
				<text class="text-content">{{myInfo.address?myInfo.address:'暂无'}}</text>
				<image src="../../../static/images/to.png" class="right-arrow right-arrow-mart28"></image>
			</view>
			<view class="list list-h100" @click="skipBaseInfo(myInfo.nation,'nation')">
				<text class="text-title">民族</text>
				<text class="text-content">{{computed_convertTable(comparisonTable, myInfo.nation,1)}}</text>
				<image src="../../../static/images/to.png" class="right-arrow right-arrow-mart28"></image>
			</view>
			<view class="list list-h100" @click="skipBaseInfo(myInfo.mobilNumber,'mobilNumber')">
				<text class="text-title">手机</text>
				<text class="text-content">{{myInfo.mobilNumber?myInfo.mobilNumber:'暂无'}}</text>
				<image src="../../../static/images/to.png" class="right-arrow right-arrow-mart28"></image>
			</view>
			<view class="list list-h100" @click="skipBaseInfo(myInfo.emailCode,'email')">
				<text class="text-title">邮箱</text>
				<text class="text-content">{{myInfo.emailCode?myInfo.emailCode:'暂无'}}</text>
				<image src="../../../static/images/to.png" class="right-arrow right-arrow-mart28"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import BetterPull from "@/comm/BetterPull";
	export default {
		components: {},
		mixins: [
			//下拉刷新
			BetterPull({
				getPage(page, done) {
					// console.log(`获取第${page}页数据`);
					//ajax获取数据后使用done保存当前页面的数据
					//setTimeout(() => {
					//	done([1, 2, 3, 4, 5]);
					//}, 1000); 
					//模拟ajax，
					// uni.request({
					//   url: base + url,
					//   method: "POST",
					//   data:{page},
					//   success: res => {
					//     var data = res.data;//获取当前页数组
					//     done(data.list)//调用done可以更新页面，同时结束下拉刷新，上拉加载
					//   },
					//   fail: err => {
					//     done([]);//如果没有数据也需要调用
					//   }
					// });
				},
				// list: "list", //变量名不冲突可以省略
				// page: "page" //变量名不冲突可以省略
			})
		],
		data() {
			return {
					userInfo: uni.getStorageSync('userInfo'),
					myInfo:null,//我的信息
					comparisonTable:[],
			};
		},
		computed: {
			ctime() {
				return function(date,format) {
					if (date)
						return this.$mainUtils._convertDate(date, format)
					else return "未知";
				}
			},
			computed_convertTable(){
				return function(table, code,index) {
					if (table)
						return this._convertTable(table, code,index)
					else return "未知";
				}
			}
				
		},
		mounted: function(){ 
				/* 
				* 初始化
				*  */
				this.getComparisonTable();
				this.getInfo();
		},
		methods:{
				/* 
				* 获取我的信息
				*  */
				getInfo(){
					this.$mainUtils.request("hr_users/info/"+this.userInfo.userId, '', "GET", (res) => {
						this.myInfo = res;
					});
				},
				
				/*
				 * 对照表转化 民族和性别
				 */
				_convertTable(table, code,index){
					let val = '';
					let positionTable = table[index]
					if(positionTable){
						if(positionTable.list.length!=0){
							for(var i = 0;i<positionTable.list.length;i++){
								if(positionTable.list[i].key === code){
									val = positionTable.list[i].value;
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
					this.$mainUtils.request("contrast/all_contrast_info",'', "GET", (res) => {
						this.comparisonTable = res;
					});
				},
				
				/* 
				* 点击我的信息列表 跳转至信息编辑页面
				*  */
				skipBaseInfo(data,title) {
					var str = null;
					if(data){
						if(title=="picture"||title=="name"||title=="address"){//处理data数据里面有&、=和?的特殊情况
							str = data.replace(/\?/g, '--why--').replace(/\&/g, '--and--').replace(/=/g, '--equal--');
						}else{
							str = data;
						}
					}
					
				  uni.navigateTo({url: "/pages/mine/mine-module/base-info-edit?title="+title+"&isPic=1&data="+str});
				},
		}
	}
</script>

<style lang="scss">
	.base-info-wrap{
		background: #fff;
	}
	.base-info{
		height: calc(100% - 88upx);
		overflow: auto;
		width: calc(100% - 60upx);
		margin: 0 30upx;
		background: #fff;
		.list-h100{
			height:100upx;
			line-height: 100upx;
		}
		.list-h160{
			height:160upx;
			line-height: 160upx;
		}
		.list{
			border-bottom:1upx solid  #ece4e4;
			width:100%;
			background-color: #fff;
			.text-title{
				float: left;
				width: 100upx;
				display: inline-block;
				font-size: 32upx;
			}
			.table-box{
				display: table;
				width: calc(100% - 180upx);
				float: left;
				text-align: right;
				height: 160upx;
				.img-box{
					display: table-cell;
					vertical-align: middle;
					.head-img{
						width: 100upx;
						height: 100upx;
						border-radius: 10upx;
					}
				}
			}
			.text-content{
				float: left;
				width: calc(100% - 180upx);
				display: inline-block;
				color: #858B9C;
				font-size: 28upx;
				text-align: right;
			}
			.right-arrow-mart28{
				margin-top: 28upx;
			}
			.right-arrow-mart58{
				margin-top: 58upx;
			}
			.right-arrow{
				flex-shrink:0;
				width:32upx;
				height:32upx;
				float: right;
				margin-top: 34upx;
			}
		}
	}
</style>
