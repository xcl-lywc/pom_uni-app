<template>
	<view class="purchase-list">
		<view class="purchase-header">
			<view class="select-area">
				<picker @change="bindPickerChange" :value="index" :range="array" range-key="orgName">
					<view class="select-box">
						<text>{{array[index].orgName}}</text>
						<text class="select-icon"></text>
					</view>
				</picker>
			</view>
		</view>
		<scroll-view v-show="!isShowTree" @scrolltolower="scorllTolower" style="height: 100vh; margin-top: 90upx;" scroll-y="true">
			<uni-segmented-control class="segmented" :current="activeTab" :values="tabs" @clickItem="onClickItem" style-type="button" active-color="#ff6955" />  
			<view class='uni-mart-20' v-for="(item, index) in listData" :key="index">
				<uni-card 
					:extra="item.taskVoList.length ? item.taskVoList[0].processTaskName : '' "
				  :is-full="true"
					:mix-title="false"
				  :title="item.taskType"
				  @click="unClick(item)"
				  :note="cnote(item)"
					:rightNoteMsgNum="item.reviewVo.total ? item.reviewVo.total.toString() : '0' ">
					<view><text class="uni-font3">{{ item.content }}</text></view>
				  <view><text class="uni-font4">截止时间: {{ctime(item.endTime)}}</text></view> 
				</uni-card>
			</view>  
			<uni-load-more :status="loadingStatus"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniCard from "@/components/uni-card/uni-card.vue"
	import glance from '@/components/jm-glance/jm-glance.vue'
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		components: {
			uniSegmentedControl,
			uniCard,
			uniIcon,
			glance,
			uniLoadMore
		},
		data() {
			return {
				isShowTree: false,
				loadingStatus: 'more',
				userInfo: uni.getStorageSync('userInfo'),
				array: uni.getStorageSync('userInfo').positions,
				index: 0,
				activeTab: 0,
				tabs: ['未完成', '已完成', '我执行的', '我发出的', '我抄送的', ],
				showProps: {
					label: 'label',
					keyId: 'value',
				},
				searhForm: {
					status: 1,
					assignee: '',
					creator: '',
					copy: '',
					pageSize: 10,
					pageNum: 1,
					orgId: uni.getStorageSync('userInfo').positions.length ? uni.getStorageSync('userInfo').positions[0].orgid : '',
				},
				listData: [],
				treeParamsData: { //查询人员树需要的参数
					processId: null,
					value: null,
					valueId: null,
					requestUrl: '/party_member_infos/partyorgtree',
					checkboxType: false,
					title: '人员组织树',
					isCheckbox: 1,
					backstageKey: [{
						"keyName": "nextAssignee",
						"prompt": ""
					}],
				},
			};
		},
		onLoad(option) {
			if (option.type) {
				this.searhForm.type = option.type;
			} 
		},
		computed: {
			ctime(){
				return function(date) {
					if (date)
						return this.$mainUtils._convertDate(date, 'yyyy.MM.dd hh:mm')
					else return "未知";
				}
			},
			cnote(){
				return function(item) {
					if (item)
						return item.creator + " " + this.$mainUtils._convertDate(item.createTime, 'yyyy.MM.dd hh:mm')
					else return "未知"; 
				}
			}
		},
		mounted() {
			this.getTaskList(true)
		},
		methods: {
			onClickItem(index) {
				this.activeTab = index;
				// ------------ 先设置为初始值 --------
				this.searhForm.status = '';
				this.searhForm.assignee = '';
				this.searhForm.creator = '';
				this.searhForm.copy = '';
				this.searhForm.pageSize = 10;
				this.searhForm.pageNum = 1;


				switch (index) {
					case 0:
						this.searhForm.status = 1;
						break;
					case 1:
						this.searhForm.status = 2;
						break;
					case 2:
						this.searhForm.status = '';
						this.searhForm.assignee = uni.getStorageSync('userInfo').userId;
						break;
					case 3:
						this.searhForm.status = '';
						this.searhForm.creator = uni.getStorageSync('userInfo').userId;
						break;
					case 4:
						this.searhForm.status = '';
						this.searhForm.copy = uni.getStorageSync('userInfo').userId;
						break;
				}
				this.getTaskList(true)
			},
			getTaskList(init) {
				if (init) {
					this.searhForm.pageNum = 1;
					this.listData = [];
				}
				this.loadingStatus = 'loading';

				// -----------根据不同的需求改变请求地址 ---------------
				var requestUrl = 't_tasks/list/org';
				if (uni.getStorageSync('taskTypePage') == 'childTask') {
					requestUrl = 't_tasks/childs/';
				}
				this.$mainUtils.request(requestUrl, this.searhForm, "GET", res => {
					if (res) {
						var rows = uni.getStorageSync('taskTypePage') == 'childTask' ? res : res.rows;

						this.listData.push(...rows) //拼接数组
						if (rows.length == 0 || rows.length < 10) { //加载后没有数据 或 返回的数据小于10条(已到末页) 显示为没有更多 并禁止再次加载
							this.loadingStatus = "noMore"
						} else {
							this.searhForm.pageNum++
						}
					} else {
						this.loadingStatus = "noMore"
					}
				});
			},
			unClick(item) {
				uni.navigateTo({
					url: '/pages/mine/task-detail?taskId=' + item.id + '&activeTab=' + this.activeTab,
				});
			},
			/* 滑动显示更多 */
			scorllTolower() {
				if (this.loadingStatus != 'noMore') {
					this.getTaskList();
				}
			},
			showTreeDialog(item) {
				this.treeParamsData.value = null;
				this.treeParamsData.processId = item.taskVoList.length ? item.taskVoList[0].processTaskId : '';
				this.isShowTree = true;
			},
			/*
			 * 获取树结构的值
			 */
			treeValDataFun(val) {
				// ---- 存储在数据库中的数据Id
				this.treeParamsData.valueId = val.value[0];
				this.saveTree();
			},
			/* 
			 * @name 改变select
			 * @param val 索引
			 *  */
			bindPickerChange: function(e) {
				let val = e.detail.value
				this.index = val;
				this.searhForm.orgId = this.array[this.index].orgid;
				this.getTaskList(true);
			},
		}
	}
</script>

<style lang="scss">
	.text-bottom {
		margin-top: 10upx;
		border-top: 1px solid #d9d9d9;
		color: #8f8f94;
		font-size: 26upx;

		.font-text {
			font-size: 26upx !important;
		}
	}

	.segmented-control {
		margin-top: 20upx;
	}

	.icon {
		width: 20upx;
		height: 20upx;
	}

	.segmented {
		margin-top: 20upx;
	}

	.item-footer {
		margin-top: 15upx;
		display: flex;
		width: 100%;
	}

	.no-data {
		text-align: center;
		padding: 40upx 0;
		background-color: white;
	}

	.purchase-list {
		background-color: #eee;
		height: 100%;
		overflow: hidden;

		.purchase-header {
			overflow: hidden;
			position: fixed;
			// top: 88upx;
			width: 100vw;
			z-index: 10;
			border-bottom: 2upx solid #ece4e4;

			.select-area {
				background-color: white;

				.select-box {
					text-align: center;
					padding: 15upx 0 5upx;
					color: #ff6955;
					font-size: 36upx;

					.select-icon {
						display: inline-block;
						width: 12upx;
						height: 12upx;
						border: 4upx solid #ff6955;
						border-left-width: 0;
						border-bottom-width: 0;
						transform: rotate(135deg);
						margin-left: 12upx;
						margin-bottom: 6upx;
					}
				}
			}

			.tabs-area {
				background-color: white;
				padding: 15upx 0;
			}
		}

		.purchase-body {
			margin-top: 176upx;
			height: calc(100% - 264upx);
			overflow: auto;
			background: #fff;
			width: 100%;

			.list {
				border-bottom: 1upx solid #ece4e4;
				padding: 0upx 0upx;
				margin: 0 30upx;
				height: 100upx;
				line-height: 100upx;
				background-color: #fff;

				.text {
					float: left;
					width: 90%;
					display: inline-block;
					font-size: 32upx;
				}

				.right-arrow {
					width: 8%;
					flex-shrink: 0;
					width: 32upx;
					height: 32upx;
					float: left;
					margin-top: 30upx;
				}
			}

		}
	}
</style>
