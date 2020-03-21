<template>
	<view>
		
		<view  class='purchase-list'>
			<view class="purchase-header">
				<view class="select-area">
					<picker @change="bindPickerChange" :value="index" :range="array" range-key="name">
							<view class="select-box">
								<text>{{array[index].name}}</text>
								<text class="select-icon"></text>
							</view>
					</picker>
				</view>
				<view class="tabs-area">
					<uni-segmented-control class="segmented" :current="initIndex" :values="tabs" @clickItem="tapChange" style-type="button" active-color="#ff6955" />
				</view>
			</view>
			<scroll-view class="purchase-body" scroll-y="true" @scrolltolower="scrolltolower" @scrolltoupper="scrolltoupper" @scroll="scroll" @touchstart="touchstart" @touchend="touchend">
				<view v-if='initIndex===0'>
						<org-brief :orgBrief="orgBrief" :type="type" @changeNext="changeNext" @getOrgBrief="getOrgBrief" ref="brief"></org-brief>
				</view>
				<view v-if='initIndex===1&&orgList'>
					<view v-if='orgList.length!=0'>
						<view
							class="list"
							v-for="(item, index) in orgList"
							:key="item.id"
							@click="initIndex = 0; next = item.id; getOrgBrief(item.id);">
							<text class="text">{{item.name}}</text>
							<image src="../../static/images/to.png" class="right-arrow"></image>
						</view>
					</view>
					<view v-else class="no-data">暂无数据</view>
				</view>
				
				<view v-if='initIndex===2'>
						<org-leader :orgLeader="orgLeader" :type="type"></org-leader>
				</view>
			</scroll-view>
		</view>
		

	</view>
</template>

<script>
	import orgBrief from "./org-components/org-brief.vue"
	import orgLeader from "./org-components/org-leader.vue"
	import BetterPull from "@/comm/BetterPull";
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	export default {
		components: {orgBrief,orgLeader,uniSegmentedControl},
		mixins: [
			//下拉刷新
			BetterPull({
				getPage(page, done) {
					// console.log(`获取第${page}页数据`);
					//ajax获取数据后使用done保存当前页面的数据
					//setTimeout(() => {
					//	done([1, 2, 3, 4, 5]);
					//}, 1000); 
					let val = this.initIndex;
					//ajax
					if( val===0 ){//组织简介
						if( this.type === 1 ){
							this.next ? this.getOrgBrief(this.next):this.getOrgBrief(this.userInfo.orgId);
							done();
						}else if( this.type === 2 ){
							this.next ? this.getOrgBrief(this.next):this.getOrgBrief(this.userInfo.partyOrgId);
							done();
						}else{
							this.orgList=null;//机构组成
							this.orgBrief=null;//组织简介
							this.orgLeader=null;//领导班子
							done();
						}
					}else if( val===1 ){//机构构成
						if( this.type === 1 ){
							this.next ? this.getOrgList(this.next):this.getOrgList(this.userInfo.orgId);
							done();
						}else if( this.type === 2 ){
							this.next ? this.getOrgList(this.next):this.getOrgList(this.userInfo.partyOrgId);
							done();
						}else{
							this.orgList=null;//机构组成
							this.orgBrief=null;//组织简介
							this.orgLeader=null;//领导班子
							done();
						}
					}else if( val===2 ){//领导班子
						if( this.type === 1 ){
							this.next ? this.getOrgLeader(this.next):this.getOrgLeader(this.userInfo.orgId);
							done();
						}else if( this.type === 2 ){
							this.next ? this.getOrgLeader(this.next):this.getOrgLeader(this.userInfo.partyOrgId);
							done();
						}else{
							this.orgList=null;//机构组成
							this.orgBrief=null;//组织简介
							this.orgLeader=null;//领导班子
							done();
						}
					}
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
					//tabs
					tabs:['组织简介','机构组成','领导班子',],
					initIndex:0,
					//select(picker)
					array: [
						{name:'我的党组织',id:uni.getStorageSync('userInfo').partyOrgId},
						{name:'我的企业',id:uni.getStorageSync('userInfo').orgId},
						{name:'我的工会组织',id:null},
						{name:'我的团组织',id:null},
					],
					index: 0,
					
					type:2,//2-我的党组织；1-我的企业;3-我的工会组织,4-我的团组织
					next:null,//有值时，表示查询机构下级或上级信息;
					
					orgList:null,//机构组成
					orgBrief:null,//组织简介
					orgLeader:null,//领导班子
			};
		},
		computed: {
				
    },
		mounted: function(){ 
				/* 
				* 初始化
				* 党组织
				*  */
				// this.getOrgBrief(uni.getStorageSync('userInfo').orgId);
				this.type = 2;
				this.next = null;
				this.getOrgBrief(uni.getStorageSync('userInfo').partyOrgId);
		},
		methods:{
				/* 
				* 改变next的值 */
				changeNext(val){
					this.next = val;
				},
				/* 
				* @name 改变select
				* @param val 索引
				*  */
				bindPickerChange: function(e) {
						let val = e.target.value
						this.index = val;
						this.next = null;
						this.initIndex = 0;
						if( val===1 ){//我的企业
							this.type = 1;
							this.getOrgBrief(this.userInfo.orgId)
						}else if( val===0 ){//我的党组织
							this.type = 2;
							this.getOrgBrief(this.userInfo.partyOrgId)
						}else if( val===2 ){//我的工会组织
							this.type = 3;
							this.orgList=null;//机构组成
							this.orgBrief=null;//组织简介
							this.orgLeader=null;//领导班子
						}else if( val===3 ){//我的团组织
							this.type = 4;
							this.orgList=null;//机构组成
							this.orgBrief=null;//组织简介
							this.orgLeader=null;//领导班子
						}
				},
				/**
				 * @name 改变tab
				 * @param val 索引
				 */
				tapChange(val){
					this.initIndex=val
					if( val===0 ){//组织简介
						if( this.type === 1 ){
							this.next ? this.getOrgBrief(this.next):this.getOrgBrief(this.userInfo.orgId);
						}else if( this.type === 2 ){
							this.next ? this.getOrgBrief(this.next):this.getOrgBrief(this.userInfo.partyOrgId);
						}else{
							this.orgList=null;//机构组成
							this.orgBrief=null;//组织简介
							this.orgLeader=null;//领导班子
						}
					}else if( val===1 ){//机构构成
						if( this.type === 1 ){
							this.next ? this.getOrgList(this.next):this.getOrgList(this.userInfo.orgId);
						}else if( this.type === 2 ){
							this.next ? this.getOrgList(this.next):this.getOrgList(this.userInfo.partyOrgId);
						}else{
							this.orgList=null;//机构组成
							this.orgBrief=null;//组织简介
							this.orgLeader=null;//领导班子
						}
					}else if( val===2 ){//领导班子
						if( this.type === 1 ){
							this.next ? this.getOrgLeader(this.next):this.getOrgLeader(this.userInfo.orgId);
						}else if( this.type === 2 ){
							this.next ? this.getOrgLeader(this.next):this.getOrgLeader(this.userInfo.partyOrgId);
						}else{
							this.orgList=null;//机构组成
							this.orgBrief=null;//组织简介
							this.orgLeader=null;//领导班子
						}
					}
				},
				/* 
				* 获取机构组成
				*  */
				getOrgList(id){
					if( this.type===1 ){//企业
						this.$mainUtils.request("org_units/list", this._listParams_(id), "GET", (res) => {
							this.orgList = res;
						});
					}else if( this.type===2 ){//党组织
						this.$mainUtils.request("party_orgs/chlidrensimple", this._listParams(id), "GET", (res) => {
							this.orgList = res;
						});
					}
				},
				_listParams(id){
				  return {
						id:id,
					}  
				},
				_listParams_(id){
				  return {
						parentId:id,
					}  
				},
				/* 
				* 获取组织简介
				*  */
				getOrgBrief(id){
					if( this.type===1 ){//企业
						this.$mainUtils.request("org_units/"+id+"/orgunit", this._briefParams(), "GET", (res) => {
							this.orgBrief = res;
							console.log(res.description)
						});
					}else if( this.type===2 ){//党组织
						this.$mainUtils.request("party_orgs/"+id+"/partyorg", this._briefParams(), "GET", (res) => {
							this.orgBrief = res;
							console.log(res.description)
							this.$refs.brief.isShowBtn(res.description)
						});
					}
				},
				_briefParams(){
				  return {
						
					}  
				},
				/* 
				* 获取领导班子
				*  */
				getOrgLeader(id,type){
					if( this.type===1 ){//企业
						this.$mainUtils.request("party_orgs/leader", this._leaderParams(id,'orgunit'), "GET", (res) => {
							this.orgLeader = res;
						});
					}else if( this.type===2 ){//党组织
						this.$mainUtils.request("party_orgs/leader", this._leaderParams(id,'partyorg'), "GET", (res) => {
							this.orgLeader = res;
						});
					}
				},
				_leaderParams(id,orgType){
				  return {
						id:id,
						type:orgType,
					}  
				},
				
				/**
				 * @name 触底加载
				 */
				scrolltolower(event){
					// this.getList(this.page,this.__pulldone)
				},
				
				scroll(e){
					// 重新设置pulldown
					this.setPullDown(e.detail.scrollTop<10)
				},
				
				scrolltoupper(){
					
				},
				
				touchstart(){
					
				},
				
				touchend(){
					
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
	.purchase-list {
		background-color: #eee;
		height: 100%;
		overflow: hidden;
		.purchase-header{
			overflow: hidden;
			position: fixed;
			// top: 88upx;
			width: 100vw;
			z-index: 10;
			border-bottom: 2upx solid #ece4e4;
			.select-area{
				background-color: white;
				.select-box{
					text-align: center;
					padding: 15upx 0 5upx;
					color: #ff6955;
					font-size: 36upx;
					.select-icon{
						display: inline-block;
						width: 12upx;
						height: 12upx;
						border: 4upx solid #ff6955;
						border-left-width:0; 
						border-bottom-width: 0;
						transform: rotate(135deg);
						margin-left: 12upx;
						margin-bottom: 6upx;
					}
				}
			}
			.tabs-area{
				background-color: white;
				padding: 15upx 0;
			}
		}
		.purchase-body{
			margin-top: 176upx;
			height: calc(100% - 264upx);
			overflow: auto;
			background: #fff;
			width:100%;
			.list{
				border-bottom:1upx solid  #ece4e4;
				padding:0upx 0upx;
				margin: 0 30upx;
				height:100upx;
				line-height: 100upx;
				background-color: #fff;
				.text{
					float: left;
					width: 90%;
					display: inline-block;
					font-size: 32upx;
				}
				.right-arrow{
					width: 8%;
					flex-shrink:0;
					width:32upx;
					height:32upx;
					float: left;
					margin-top: 30upx;
				}
			}
			
		}
	}
</style>
