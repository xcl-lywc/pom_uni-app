<template>
	<view>
		<view class="header" v-bind:class="{'status':isH5Plus}">
			<view class="userinfo" v-if="userinfo">
				<view class="face">
					<image v-if="userinfo.picture" :src="userinfo.picture" @click="skipEditHeadImage(userinfo.picture)"></image>
					<view v-else class="image" @click="skipEditHeadImage(userinfo.picture)">未上传头像</view>
				</view>
				<view class="info">
					<view class="username">姓名:{{userinfo.name ? userinfo.name : ''}} <text v-if="!userinfo.sex"> </text>
						<fa-icon v-if="userinfo.sex&&userinfo.sex === 105" type="mars" size="15" color="#fff" class="uni-marl-10"></fa-icon>
						<fa-icon v-if="userinfo.sex&&userinfo.sex === 106" type="mars-stroke" size="15" color="#fff" class="uni-marl-10"></fa-icon>
					</view>
					<view class="username borthday">生日:
						<text v-if="userinfo.borthday">{{ birthdayStr }}</text>
						<fa-icon v-else @click="toModifyBorthday" type="edit" size="18" color="#409eff" class="uni-marl-10"></fa-icon>
					</view>
					<view class="username">住址: {{userinfo.address ? userinfo.address: ''}}</view>
				</view>
				<view class="info setting">
					<uni-icon @click="skipBaseInfo" class="font-color-weight" type="gear" size="25"></uni-icon>
				</view>
			</view>
		</view>
		<view class="nav-box">
			<view v-for="(item, index) in severList" :key="index">
				<view :class="{'uni-height-20':item.space,'uni-background-eee':item.space,}"></view>
				<cmd-cell-item slot-right :title="item.name" arrow @click="toPage(item)">
					<view>{{item.addon}}</view>
				</cmd-cell-item>
			</view>
		</view>
	</view>
</template>
<script>
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	import cmdCellItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	export default {
		components: {
			uniIcon,
			cmdCellItem,
			faIcon
		},
		data() {
			return { 
				isH5Plus:false,
				userinfo: uni.getStorageSync('userInfo'),
				sexText:	null, 
				userId: uni.getStorageSync('userInfo') ? uni.getStorageSync('userInfo').userId : null, 
				severList: [{
						name: '我的签到',
						icon: '../../static/images/mynotice.png',
						url: '/pages/mine/calendar/calendar',
						addon: '签到',
						type: '',
						space: true
					},
					{
						name: '我的积分',
						icon: '../../static/images/mytask.png',
						url: '/pages/mine/integral',
						addon: '',
						type: '',
						space: false
					},
					{
						name: '我的任务',
						icon: '../../static/images/mymeeting.png',
						url: '/pages/mine/task-list',
						addon: '',
						type: 'task',
						space: false
					},
					{
						name: '我的会议',
						icon: '../../static/images/mytask.png',
						url: '/pages/mine/meeting/meeting-list',
						type: '',
						space: false
					},
					{
						name: '我的组织',
						icon: '../../static/images/myshenpi.png',
						url: '/pages/org/org',
						type: '',
						space: false
					},
					{
						name: '组织生活',
						icon: '../../static/images/myshenpi.png',
						url: '/pages/mine/org-life/org-life',
						type: '',
						space: false
					},
					{
						name: '我的收藏',
						icon: '../../static/images/aboutus.png',
						url: '/pages/mine/collect',
						type: '',
						space: false
					},
					{
						name: '关于我们',
						icon: '../../static/images/setting.png',
						url: '/pages/mine/setting',
						type: '',
						space: true
					},
					{
						name: '帮助',
						icon: '../../static/images/setting.png',
						url: '/pages/mine/setting',
						type: '',
						space: false
					}
				], 
			};
		},
		// onLoad() {
		// 	//加载
		// 	this.init();
		// },
		computed: {
			birthdayStr() {
				var userinfo = this.userinfo
				if(userinfo&&userinfo.borthday)
					return 　this.$mainUtils._convertDate(userinfo.borthday.date_time, 'yyyy.MM.dd');
				else
				return "";
			}
		},
		mounted() {
			this.getQueryContrast();
			this.getInfo();
		},
		methods: {
			/* 
			 * 获取我的信息
			 *  */
			getInfo() {
				this.$mainUtils.request("hr_users/info/" + this.userId, '', "GET", (res) => {
					this.userinfo = res;
				});
			},

			// /* 
			//  * 基本信息
			//  *  */
			// init() {
			// 	const self = this;
			// },

			/* 
			 * 点击我的头像 修改头像
			 *  */
			skipEditHeadImage(url) {
				var newUrl = null;
				if (url) {
					//处理data数据里面有&、=和?的特殊情况
					newUrl = url.replace(/\?/g, '--why--').replace(/\&/g, '--and--').replace(/=/g, '--equal--');
				}
				uni.navigateTo({
					url: "/pages/mine/mine-module/base-info-edit?title=picture&isPic=1&data=" + newUrl
				});
			},

			/* 去修改头像 */
			toModifyBorthday() {
				let str = null;
				let title = 'borthday';
				uni.navigateTo({
					url: "/pages/mine/mine-module/base-info-edit?title=" + title + "&isPic=1&data=" + str
				});
			},

			/* 
			 * 点击设置按钮 跳转至我的基本信息页面
			 *  */
			skipBaseInfo() {
				uni.navigateTo({
					url: "/pages/mine/mine-module/base-info"
				});
			},

			//用户点击列表项
			toPage(item) {
				if (item.type == 'task') {
					uni.setStorageSync('taskTypePageName', '我的任务'); 
				}
				if (item.url) {
					uni.navigateTo({
						url: item.url
					});
				}
				uni.showToast({
					title: item.name,
					icon: "none"
				});
			},
			/* 根据类别查询 */
			getQueryContrast() {
				this.$mainUtils.request("contrast/bytype", {
					typeId: 1
				}, "GET", res => {
					res.rows.forEach((item) => {
						if (uni.getStorageSync('userInfo').sex == item.id) {
							this.sexText = item.value;
						}
					});
				});
			},
		}
	}
</script>

<style lang="scss">
	page {}

	.header {
		&.status {
			padding-top: var(--status-bar-height);
		}

		background-color:#ff6955;
		width:92%;
		height:30vw;
		padding:0 30upx;
		display:flex;
		align-items:center;

		.userinfo {
			width: 100%;
			display: flex;

			.face {
				flex-shrink: 0;
				width: 15vw;
				height: 15vw;

				image {
					width: 100%;
					height: 100%;
					border-radius: 100%
				}

				.image {
					width: 100%;
					height: 100%;
					border-radius: 100%;
					background: #fff;
					text-align: center;
					font-size: 24upx;
					color: #666;
					padding-top: 20upx;
					box-sizing: border-box;
				}
			}

			.info {
				display: flex;
				flex-flow: wrap;
				padding-left: 30upx;

				.username {
					width: 100%;
					color: #fff;
					font-size: 30upx
				}

				.integral {
					display: flex;
					align-items: center;
					padding: 0 20upx;
					margin-top: 10upx;
					color: #fff;
					background-color: rgba(0, 0, 0, 0.1);
					border-radius: 20upx;
					font-size: 24upx
				}

				.borthday {
					uni-button[size=mini] {
						line-height: 1.8;
					}

					uni-button[type=primary][plain] {
						position: relative;
						top: 10upx;
						left: 20upx;
						color: #FFFFFF;
						border-color: #FFFFFF;
					}
				}
			}
		}

		.setting {
			flex-shrink: 0;
			width: 6vw;
			height: 6vw;

			image {
				width: 100%;
				height: 100%
			}

			position: absolute;
			right: 30upx;
			top: 32upx;
		}
	}

	.hover {
		background-color: #eee
	}

	.orders {
		background-color: #ff6955;
		width: 92%;
		height: 11vw;
		padding: 0 4%;
		display: flex;
		align-items: flex-start;
		border-radius: 0 0 100% 100%;
		margin-top: -2upx;
	}

	.list {
		width: 100%;
		border-bottom: solid 26upx #f1f1f1;

		.li {
			width: 92%;
			height: 100upx;
			padding: 0 4%;
			border-bottom: solid 1upx #e7e7e7;
			display: flex;
			align-items: center;

			&.noborder {
				border-bottom: 0
			}

			.icon {
				flex-shrink: 0;
				width: 50upx;
				height: 50upx;

				image {
					width: 50upx;
					height: 50upx
				}
			}

			.text {
				padding-left: 20upx;
				width: 100%;
				color: #666;
				font-size: 29upx
			}

			.to {
				flex-shrink: 0;
				width: 40upx;
				height: 40upx
			}
		}
	}

	.font-color-weight {
		color: #fff;
	}

	.nav-box {
		background-color: #fff
	}
</style> 