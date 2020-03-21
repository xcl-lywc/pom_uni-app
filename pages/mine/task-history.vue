<template>
	<view v-if="hisToryData" class="backgroundFFF"> 
		<view> 
			<view 
				v-for="(item, index) in formData" 
				:key="index"
				v-if="item.type != 'inputButton'"
			>     
				<cmd-cell-item  v-if="item.type == 'skipApproval' || item.type == 'inputRadio' " :title="item.title" :show-switch="true" :switch-state="item.value ? true : false" :disabled="true" slot-right>
					<view><switch :checked="item.value ? true : false" /></view>
				</cmd-cell-item>
				<cmd-cell-item v-else-if="item.type == 'createVote' " :title="item.title" arrow @click="checkVote(item)"> </cmd-cell-item>
				<cmd-cell-item  v-else-if="item.type == 'inputFile' || item.type == 'editFile' " :title="item.title" slot-right>
					<view class="file">  
						<text v-for="(itemFile, indexFile) in item.value" :key="indexFile" class="item-file" @click="download(itemFile.fileId)">
							{{itemFile.name}}
						</text>
					</view>
				</cmd-cell-item>
				<cmd-cell-item  v-else :title="item.title" :addon="item.value" slot-right>
					{{item.value}}
				</cmd-cell-item>
			</view> 
		</view>
		<view style="text-align: center;margin-top: 30px; color: rgb(152, 149, 149);">
			暂不能查看此流程详情
		</view>
	</view>
</template>
<script>
	import cmdCellItem from "@/components/cmd-cell-item/cmd-cell-item.vue"
	import uniCard from "@/components/uni-card/uni-card.vue"
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"  
	import uniIcon from "@/components/uni-icon/uni-icon.vue"  
	export default {
		mounted() {},
		components: {cmdCellItem,uniCard,uniSegmentedControl,uniIcon},
		data() {
			return {
				hisToryData: uni.getStorageSync('hisToryData') ? JSON.parse(uni.getStorageSync('hisToryData')) : null,  
				formData: 	 null,
			};
		},
		onLoad: function(option) {  
			this.convertFormData(this.hisToryData.formData ? JSON.parse(this.hisToryData.formData) : this.hisToryData.formData)
		}, 
		methods: {
			convertFormData(formData){
				if(formData){
					formData.forEach( (item) => {
						if(item.type == 'tree'){   
							item.value = item.value.join(','); 
						}else if(item.type == 'date'){
							item.value = this.$mainUtils._convertDate(item.value, 'yyyy.MM.dd')
						}else if(item.type == 'inputFile' || item.type == 'editFile'){
							 
						}else{
							item.value = item.value ? item.value.toString() : '';
						}
						
					})
				}
				this.formData = formData;
			},
			/* 点击查看问卷 */
			checkVote(item){
				uni.navigateTo({
					url: '/pages/mine/task-component/vote-detail?voteId=' + item.value,
				})
			},
			/* 
			* 
			* 文件下载
			*  */
			download(id){ 
				this.$mainUtils.download(id,res =>{
					if (res.statusCode === 200) {
						uni.showToast({
							title: '下载成功',
							duration: 2000,
							icon: 'none',
							mask: true
						});
						var filePath = res.tempFilePath;//临时文件路径
						//打开文件
						uni.openDocument({
							filePath: filePath,
							success: function (res) {
								console.log('打开文件成功');
							},
							fail() {
								uni.showToast({
									title: '该文件不支持，无法打开',
									icon: 'none',
									duration: 2000
								})
							}
						}); 
					}
				})
			},
		} 
	}
</script>
<style lang="scss"> 
	.review{
		padding: 20upx;
		border-bottom: 2upx solid #c8c7cc;
		.review-header{ 
			.img-view{
				image{
					width: 60upx;
					height: 60upx;
				}
			}  
		}
		.content{
			margin-left: 82upx;
		} 
	} 
	.file{
			// background-color: aqua;
			width: 400upx;
			text-align: right;
			.item-file{
				color: #2196F3;
				display: inline-block;
				width: 100%;
				// word-wrap: break-word;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				text-decoration: underline;
			}
		}
</style>