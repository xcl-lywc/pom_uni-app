<template>
	<view> 
		<view v-for="(item, index) in severList" :key="index">
			<view :class="{'uni-height-20':item.space,'uni-background-eee':item.space,}"></view>
			<cmd-cell-item :title="item.name" :addon="item.addon" arrow @click="toPage(item)"></cmd-cell-item>
		</view> 
	</view>
</template>
<script>
	import uniIcon from "@/components/uni-icon/uni-icon.vue" 
	import cmdCellItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	export default {
		components:{uniIcon,cmdCellItem},
		data() {
			return {
				userinfo: uni.getStorageSync('userInfo'),
				severList:[
						{name:'入党申请',icon:'../../../../static/images/mynotice.png',url:'/pages/mine/task-list?type=10',space:true},
						{name:'转正申请',icon:'../../../../static/images/mytask.png',url:'/pages/mine/task-list?type=12',space:false},
						{name:'党员档案',icon:'../../../../static/images/mymeeting.png',url:'',space:false},
						{name:'我的规划',icon:'../../../../static/images/mytask.png',url:'/pages/mine/org-life/my-plan',space:true},
						{name:'我的总结',icon:'../../../../static/images/myshenpi.png',url:'/pages/mine/org-life/my-sum',space:false},
						{name:'我的报告',icon:'../../../../static/images/aboutus.png',url:'/pages/mine/org-life/my-report',space:false},
						{name:'我的建议',icon:'../../../../static/images/aboutus.png',url:'/pages/mine/org-life/my-advice',space:true},
						{name:'我的请假',icon:'../../../../static/images/setting.png',url:'/pages/mine/org-life/leave/my-leave',space:true},
						{name:'谈心谈话',icon:'../../../../static/images/setting.png',url:'/pages/mine/org-life/conversation/conversation',space:true},
						{name:'投票调研',icon:'../../../../static/images/setting.png',url:'',space:false}
					],
			};
		},
		onLoad() {
			
		},
		mounted() {
			
		},
		methods: {
		
			//点击列表项
			toPage(item){   
				if(item.url){
					uni.setStorageSync('taskTypePageName', item.name);
					uni.navigateTo({
						url: item.url
					});
				}
				uni.showToast({title: item.name,icon:"none"});
			},
			
		}
	}
</script>

<style lang="scss">
 page{background-color:#fff}
.header{
	&.status{padding-top:var(--status-bar-height);}
	background-color:#ff6955;width:92%;height:30vw;padding:0 4%;display:flex;align-items:center;
	.userinfo{
		width:100%;display:flex;
		.face{flex-shrink:0;width:15vw;height:15vw;
			image{width:100%;height:100%;border-radius:100%}
		}
		.info{
			display:flex;flex-flow:wrap;padding-left:30upx;
			.username{width:100%;color:#fff;font-size:30upx}
			.integral{display:flex;align-items:center;padding:0 20upx;margin-top:10upx;color:#fff;background-color:rgba(0,0,0,0.1);border-radius:20upx;font-size:24upx}
		}
	}
	.setting{
		flex-shrink:0;width:6vw;height:6vw;
		image{width:100%;height:100%}
		position: absolute;
    right: 30upx;
    top: 32upx;
	}
}
.hover{background-color:#eee}
.orders{
	background-color:#ff6955;width:92%;height:11vw;padding:0 4%;display:flex;align-items:flex-start;border-radius:0 0 100% 100%;margin-top: -2upx;
}
.list{
	width:100%;border-bottom:solid 26upx #f1f1f1;
	.li{
		width:92%;height:100upx;padding:0 4%;border-bottom:solid 1upx #e7e7e7;display:flex;align-items:center;
	&.noborder{border-bottom:0}
		.icon{
			flex-shrink:0;width:50upx;height:50upx;
			image{width:50upx;height:50upx}
		}
		.text{padding-left:20upx;width:100%;color:#666;font-size: 29upx}
		.to{flex-shrink:0;width:40upx;height:40upx}
	}
}
.font-color-weight{
	color: #fff;
}
</style>