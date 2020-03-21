<template>
	<view class="base-info-edit-wrap">
		<view class="base-info-edit">
			<view v-if="options.title=='picture'" class="upload-img">
				<view class="container flex">
					<view style="text-align: center;">
						<image :src="src" class="avatar" @tap="upload('album', 'camera')"></image>
						<view class="flex">
							<view class="button-sp-area btn-flex">
								<button type="primary" plain="true" class="mart15"  size="mini" @tap="upload('camera',null)">拍照上传</button>
								
								<button type="primary" plain="true" class="mart15"  size="mini" @tap="upload('album', null)">从相册中选择</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="options.title=='name'||options.title=='address'||options.title=='mobilNumber'||options.title=='email'">
				<view class="uni-list-cell uni-list-cell-pd" >
					<input class="uni-input" placeholder="请输入" v-model="inputVal" maxlength="140" @input="inputInput" @blur="inputBlur"/>
				</view>
			</view>
			<view v-if="options.title=='sex'||options.title=='nation'">
				<view v-if="options.title=='sex'">
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="item in sexData" :key="item.key">
								<radio :value="String(item.key)" :checked="item.key === Number(options.data)" />{{item.value}}
						</label>
					</radio-group>
				</view>
				<view class="uni-list" v-if="options.title=='nation'&&nationData">
					<view  class="uni-list-cell uni-list-cell-pd">民族（当前）</view>
					<label class="uni-list-cell uni-list-cell-pd">
						<view>
							<radio value="options.data" :checked="true" />
						</view>
						<view>{{_convertTable(comparisonTable,Number(options.data),1)}}</view>
					</label>
					<view  class="uni-list-cell uni-list-cell-pd">全部民族（请选择）</view>
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="item in nationData" :key="item.key">
							<view>
								<radio :value="String(item.key)" :checked="item.key === Number(options.data)" />
							</view>
							<view>{{item.value}}</view>
						</label>
					</radio-group>
        </view>
			</view>
			<view v-if="options.title=='borthday'">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							 生日
						</view>
						<view class="uni-list-cell-db">
							<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
								<view class="uni-input">{{date}}</view>
							</picker>
						</view>
						<view class="uni-list-cell-right no-borthday">(未填写时，显示当前日期)</view>
					</view>
        </view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
					userInfo: uni.getStorageSync('userInfo'),//用户信息
					options:null,//参数信息
					comparisonTable:[],//对照表
					sexData:[],//性别列表
					nationData:[],//民族列表
					newVal:null,//新修改的信息
					src: null,//头像图片路径
					inputVal:null,//姓名、地址、手机、邮箱
					date: null,//生日，option.date为null时，取当前时间
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}	
    },
		onLoad(option) {
			console.log(option)
			let optionObj = option;
			
			if (optionObj) {
				
				//处理optionObj.data数据里面有&、=和?的特殊情况
				let newData = null;
				if(optionObj.title=="picture"||optionObj.title=="name"||optionObj.title=="address"){
					newData = optionObj.data.replace(/--why--/g, '?').replace(/--and--/g, '&').replace(/--equal--/g, '=');
				}else{
					newData = optionObj.data;
				}
				
				//头像路径
				optionObj.title == 'picture' ? this.src = newData : null;
				optionObj.title == 'picture'&&optionObj.isPic == '2' ? this.newVal = newData : null;
				
				//options
				this.options = optionObj;
				
				//生日
				if(optionObj.title=='borthday'){
					newData=='null'||newData=='' ? 
					this.date = this.getDate({format: true}) : this.date = this.$mainUtils._convertDate(Number(newData), 'yyyy-MM-dd');
				}
				
				//top导航栏标题
				let title = '编辑'
				switch(optionObj.title) {
					case 'picture':
						title = '更换头像';
						break;
					case 'account':
						title = '账号';
						break;
					case 'name':
						title = '姓名';
						break;
					case 'sex':
						title = '性别';
						break;
					case 'borthday':
						title = '生日';
						break;
					case 'address':
						title = '地址';
						break;
					case 'nation':
						title = '民族';
						break;
					case 'mobilNumber':
						title = '手机号';
						break;
					case 'email':
						title = '邮箱';
						break;
					default:
						title = '编辑';
						break;
				}
				uni.setNavigationBarTitle({
						title: title
				});
				
			} 
			
			
		},
		mounted: function(){ 
				/* 
				* 初始化
				*  */
				this.echoInput();
				this.getComparisonTable();
		},
		//顶部导航条上的保存按钮
		onNavigationBarButtonTap(val) {  
				console.log(val);  
				console.log(this.newVal);
				if(this.newVal==""||this.newVal==null){
					uni.showToast({
						title: '您尚未修改信息',
						duration: 2000,
						icon: 'none',
						mask: true
					});
				}else{
					this.editInfo();
				}
		},
		methods:{
				/* 
				* 编辑我的信息
				*  */
				editInfo(){
					this.$mainUtils.request("hr_users/update/"+this.userInfo.userId, this._editParams(), "PUT", (res) => {
						console.log(res != undefined)
						uni.redirectTo({
							url: '/pages/mine/mine-module/base-info',
							success:function(){}
						})
						if(res != undefined ){
							uni.redirectTo({
							  url: '/pages/mine/mine-module/base-info',
								success:function(){}
							})
							console.log(0)
						}
					});
				},
				_editParams(){
					if(this.options.title=="picture"){
						return{userId:this.userInfo.userId,picture:this.newVal} 
					}else if(this.options.title=="name"){
						return{userId:this.userInfo.userId,name:this.newVal} 
					}else if(this.options.title=="address"){
						return{userId:this.userInfo.userId,address:this.newVal} 
					}else if(this.options.title=="mobilNumber"){
						return{userId:this.userInfo.userId,mobilNumber:this.newVal} 
					}else if(this.options.title=="email"){
						return{userId:this.userInfo.userId,emailCode:this.newVal} 
					}else if(this.options.title=="sex"){
						return{userId:this.userInfo.userId,sex:this.newVal} 
					}else if(this.options.title=="nation"){
						return{userId:this.userInfo.userId,nation:this.newVal} 
					}else if(this.options.title=="borthday"){
						return{userId:this.userInfo.userId,borthday:{date_time:this.newVal,type:3}} 
					}else{
						return{userId:this.userInfo.userId} 
					}
					
				},
				
				/* 
				* 上传头像---从相册选图
				*  */
				upload(typeOne,typeTwo) {
					let sourceTypeArr = [];
					typeTwo ? sourceTypeArr = [typeOne,typeTwo]: sourceTypeArr = [typeOne];
					uni.chooseImage({
						count: 1, // 	最多可以选择的图片张数，默认9
						sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
						sourceType: sourceTypeArr, // album 从相册选图，camera 使用相机，默认二者都有
						success(res) {
							const src = res.tempFilePaths[0];
							uni.redirectTo({url: "/pages/mine/mine-module/upload-headimg?src="+src});
						}
					});
				},
				
				/* 
				* 姓名、地址、手机、邮箱的input框回显数据
				*  */
				echoInput(){
					if(this.options.title=='account'||this.options.title=='name'||this.options.title=='address'||this.options.title=='mobilNumber'||this.options.title=='email'){
						this.inputVal = this.options.data!='null'?this.options.data:'';
					}
				},
				
				/* 
				* 姓名、地址、手机、邮箱的inputInput事件
				*  */
				inputInput(e){
					this.newVal = e.target.value;
				},
				
				/* 
				* 姓名、地址、手机、邮箱的inputBlur事件
				*  */
				inputBlur(e){
					
				},
				
				/* 
				* 获取民族、性别、对照表数据
				* */
				getComparisonTable(){
					if(this.options.title=='sex'||this.options.title=='nation'){
						this.$mainUtils.request("contrast/all_contrast_info",'', "GET", (res) => {
							if(res){
								this.comparisonTable = res;
								this.sexData = res[0].list;
								this.nationData = res[1].list;
							}
						});
					}
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
				* 民族、性别的radioChange事件
				*  */
				radioChange: function(e) {
					this.options.data = e.target.value;
					this.newVal = Number(e.target.value);
        },
				
				/* 
				* 生日的bindDateChange事件
				*  */
				bindDateChange: function(e) {
				  this.date = e.target.value;
					this.newVal = new Date(e.target.value).getTime();//转化为时间戳
				},
				getDate(type) {
					const date = new Date();
					let year = date.getFullYear();
					let month = date.getMonth() + 1;
					let day = date.getDate();
				
					if (type === 'start') {
							year = year - 60;
					} else if (type === 'end') {
							year = year + 2;
					}
					month = month > 9 ? month : '0' + month;;
					day = day > 9 ? day : '0' + day;
					return year+'-'+month+'-'+day;
				},
		}
	}
</script>

<style lang="scss">
	.base-info-edit-wrap{
		background: #fff;
		height: 100vh;
	}
	.base-info-edit{
		height: calc(100% - 88upx);
		overflow: auto;
		width: calc(100% - 60upx);
		margin: 0 30upx;
		background: #fff;
		.upload-img{
			.container{
			  width: 100%;
			  height: 100%;
			}
			.avatar-container{
			  position: relative;
			  text-align: center;
			  padding-top: 50%;
			}
			.avatar{
			  width: 300upx;
			  height: 300upx;
			  background-color: #e5e5e5;
			  border-radius: 50%;
				margin: 50upx;
			}
			
			.btn-flex{
				width: 50%;
				margin: 20upx auto 0;
			}
		}
		.no-borthday{
			font-size: 24upx;
			color: #9E9E9E;
		}
	}
</style>
