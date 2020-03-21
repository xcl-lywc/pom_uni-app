<template>
	<view class="backgroundFFF"> 
		<!-- {{submitForm}} -->
		<!-- 等几个表单都绑定完毕，并且没有显示树形下拉 -->
		<view class="uni-padding-wrap " v-if="submitForm && showLabelForm && !isShowTree">
			<form @submit="formSubmit" @reset="formReset">
				<view 
					v-for="(item, index) in formData" 
					:key="index" 
					v-if=" item.type != 'inputButton' "
					class="uni-form-item uni-column uni-list"> 
					<!-- {{item.backstageKey[0].keyName}} -->
					<view class="title" >
						<view class="fl" v-if="item.type != 'createVote'">{{item.title}}</view>
						<button v-if=" item.type == 'inputFile' " class="fr" @click.native="clickUpload(item)" type="primary" size="mini">上传附件</button>
						<!-- 导出结果 -->
            <export-result v-if=" item.type == 'exportResult' " class="fr" :itemParams="item" :taskId="taskDetail.taskVoList[0].processTaskId" :instanceId="taskDetail.id"></export-result>
					</view>
					<!-- 树结构数据 -->  
					<view v-if="item.type == 'tree' "  @click="showTree(item)" class="uni-input">
						{{showLabelForm[item.backstageKey[0].keyName]}}
						<uni-textarea v-if="!showLabelForm[item.backstageKey[0].keyName]" data-v-eff6e2cc="" class="uni-input" style="padding: 16upx 0;">
							<div class="uni-textarea-wrapped">
								<div class="uni-textarea-placeholder">请选择{{item.title}}</div>
								<div class="uni-textarea-compute">
									<div>.</div>
									<uni-resize-sensor><div><div></div></div><div><div></div></div></uni-resize-sensor></div>
									<textarea maxlength="140" disabled :placeholder="'请选择${item.title}'" class="uni-textarea-textarea"></textarea>
								</div>
						</uni-textarea>
					</view>
					<!-- 单行文本 --> 
					<input v-if="item.type == 'inputText' " @input="inputKeyUp($event, item)" class="uni-input"  :placeholder="'请输入${item.title}'"></input>
					<!-- 数字 -->
					<input v-if=" item.type == 'inputNumber' " @input="inputKeyUp($event, item)" type="number" class="uni-input"  :placeholder="'请输入${item.title}'"></input>
					<!-- 多行文本 -->
					<textarea v-if="item.type == 'textarea'" @input="inputKeyUp($event, item)" class="uni-input" auto-height  :placeholder="'请输入${item.title}'"/>
					<!-- 日期 --> 
					<view v-if="item.type == 'date'" @click.native="showPicker(item)" class="uni-input">
						{{submitForm[item.backstageKey[0].keyName] ? $mainUtils._convertDate(submitForm[item.backstageKey[0].keyName], 'yyyy-MM-dd') : ''}}
						<uni-textarea v-if="!submitForm[item.backstageKey[0].keyName]" data-v-eff6e2cc="" class="uni-input" style="padding: 16upx 0;">
							<div class="uni-textarea-wrapped">
								<div class="uni-textarea-placeholder">请选择{{item.title}}</div>
								<div class="uni-textarea-compute">
									<div>.</div>
									<uni-resize-sensor><div><div></div></div><div><div></div></div></uni-resize-sensor></div>
									<textarea disabled maxlength="140" :placeholder="'请选择${item.title}'" class="uni-textarea-textarea"></textarea></div>
						</uni-textarea>
					</view>
					<!-- 上传附件 --> 
					<view v-if=" item.type == 'inputFile' && item.requestUrl " style="padding: 16upx;">文件路径: {{item.requestUrl}}</view>
					<!-- 表格 -->
					<my-table v-if=" item.type == 'table' " :tableParams="item" :taskId="taskDetail.taskVoList[0].processTaskId" :instanceId="taskDetail.id"></my-table>
					<!-- 单选框 --> 
					<view class="uni-list" 	v-if=" item.type == 'inputRadio' ">
            <radio-group @change="radioChange($event, item)">
                <label class="uni-list-cell uni-list-cell-pd" v-for="(itemBox, indexBox) in item.option" :key="indexBox">
                    <view>
                      <radio  :value="itemBox.value">{{itemBox.name}}</radio>
                    </view>
                    <view>{{item.name}}</view>
                </label>
            </radio-group>
					</view>
					<!-- 复选框 --> 
					<view class="uni-list" 	v-if=" item.type == 'inputCheckBox' ">
					  <checkbox-group @change="checkboxChange($event, item)">
					      <label class="uni-list-cell uni-list-cell-pd" v-for="(itemBox, indexBox) in item.option" :key="indexBox">
					          <view>
					            <checkbox  :value="itemBox.value">{{itemBox.name}}</checkbox>
					          </view>
					          <view>{{item.name}}</view>
					      </label>
					  </checkbox-group>
					</view> 
					<!-- 跳过审批 -->
					<checkbox v-if=" item.type == 'skipApproval' " :value="item.value">跳过审批</checkbox>
				</view> 
				<view>
					<div style=" ">提示：<text style="color: #FF9800">下一步处理人</text>与<text style="color: #FF9800">下一步处理领导</text>，选择其中一个，另外一个程序将会自动去掉之前选中的人，因为只能选择一个人。</div>
				</view>
				<view class="uni-btn-v">  
					<button 
            v-for="(item, index) in formData" 
            :key="index"
            v-if=" item.type == 'inputButton' " 
            type="primary" 
            @click="saveForm(item.buttonMess, 'formData')">
                {{item.title}}
          </button> 
				</view>
			</form>  
		</view> 
		<w-picker mode="date" startYear="2016" endYear="2030" :defaultVal="defaultVal1" @confirm="onDateConfirm" ref="picker1" themeColor="#f00"></w-picker> 
		<my-tree   
			class="marb20" 
			v-for="(item, index) in formData" 
			:key="index"
			v-if="item.type == 'tree' && isShowTree"
			v-show="item.id == showTreeId"
			:paramsData="item"  
			@treeValData="treeValDataFun($event, item)"></my-tree> 
	</view>
</template>
<script> 
  import myTree    from "./tree.vue"
	import myTable    from "./table.vue"
	import createVote from "./create-vote.vue"
	import exportResult from "./export-result.vue"
	import editFile 	from "./edit-file.vue"
	import wPicker from "@/components/w-picker/w-picker.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	export default {
		components:	 { uniListItem, wPicker, myTree, myTable, exportResult, createVote, editFile}, 
		mounted() 	 { 
		}, 
		data() { 
			return {
				defaultVal1: [0,1,0], 
				taskDetail: uni.getStorageSync('addTaskFormData'),  
				formData:   [],
				fixedTreeMemberCompontentDataOne: { //固定的人员数，每次加载表单时，都固定的在表单中添加一个人员数
					"type": "tree",
					"value": [],
					"requestUrl": "/party_member_infos/partyorgtree",
					"title": "下一步处理人",
					"prompt": "",
					"isRequired": true,
					"isMultiSelection": false,
					"isProcess": false,
					"isKeyPrompt": "",
					"toolTipPortal": {
						"isShow": false
					},
					"style": {
						"isActive": false,
						"iconFontClass": "icon-danxingwenben",
						"hoverChoice": {
							"width": 300
						}
					},
					"backstageKey": [{
						"keyName": "nextAssignee",
						"prompt": ""
					}],
					"isCheckbox": 1, //0为多选，1为单选
					"id": 1
				}, 
				fixedTreeMemberCompontentDataTwo: { //固定的人员数，每次加载表单时，都固定的在表单中添加一个人员数
					"type": "tree",
					"value": [],
					"requestUrl": "/party_member_infos/partyorgtree/postion",
					"title": "下一步处理领导",
					"prompt": "",
					"isRequired": false,
					"isMultiSelection": false,
					"isProcess": false,
					"isKeyPrompt": "",
					"toolTipPortal": {
						"isShow": false
					},
					"style": {
						"isActive": false,
						"iconFontClass": "icon-danxingwenben",
						"hoverChoice": {
							"width": 300
						}
					},
					"backstageKey": [{
						"keyName": "nextAssigneeOrg",
						"prompt": ""
					}],
					"isCheckbox": 1, //0为多选，1为单选
					"id": 1
				},
				submitForm: 	 {
					riqi: new Date().Format('yyyy-MM-dd')
				}, 	 //提交表单数据 ，
				showLabelForm: 	 null,  //页面显示数据 ， 
				activeKey: 			 null,
				isShowTree:      false, // true为显示左侧树， false则为隐藏
				showTreeId: 		 null, //被显示树的Id
			};
		},
		onLoad: function(option) {   
			let detail = uni.getStorageSync('addTaskFormData'), title;
			if(detail.formTypeT ? detail.formTypeT == 'metting' : ''){
				title = '请假'
			}else{
				title = taskVoList[0].processTaskName;
			}
			uni.setNavigationBarTitle({
				title: title
			})
			this.getFormData(option);
			
		}, 
		methods: {
			/*
			 * 查询表单数据
			 */
			getFormData(option) {
				let url ;
				if(this.taskDetail.formTypeT ? this.taskDetail.formTypeT == 'metting' : ''){
					url = 't_form_data/first/87';
				}else{
					url = "t_form_data/"+this.taskDetail.taskVoList[0].processTaskId;
				}
				this.$mainUtils.request(url, {}, 'get', (res) => {
					this._addKeyName(res.formDataStr ? JSON.parse(res.formDataStr) : []);
					// this._obtainFormData(option);
				}) 
			 },
			/*
			 * 在表单数据中添加一个键值，以便表单做非空验证
			 * @params {object} data 表单数据
			 */
			_addKeyName(data){ 
				let treeCount = 0;
				this.isShowTree = false; // 先设置为隐藏状态
				let isOperation = false; // true不给提示，false给出提示
				this.fixedTreeMemberCompontentDataOne.id = data.length;
				this.fixedTreeMemberCompontentDataTwo.id = data.length + 1;
				this.fixedTreeMemberCompontentDataOne.value = [];
				this.fixedTreeMemberCompontentDataTwo.value = [];
				data.push(this.fixedTreeMemberCompontentDataOne);
				data.push(this.fixedTreeMemberCompontentDataTwo);
				this.submitForm = {};
				this.showLabelForm = {};
				if(data.length){
					data.forEach( (item, index) => { 
						this.submitForm[item.backstageKey[0].keyName] = item.value;
						this.showLabelForm[item.backstageKey[0].keyName] ='';
						item[item.backstageKey[0].keyName] = item.value;
						// --- 显示数据错误的提示信息 ---
						item.isShowPrompt = false;
						if(item.type == 'tree'){ //处理人员数
							treeCount++; 
							if(treeCount == 1) this.showTreeId = item.id;
						}else if(item.type == 'inputButton'){ //处理按钮
							 
						}else if(item.type == 'skipApproval'){ //给跳过审批重新赋值
							item[item.backstageKey[0].keyName] = item.value = this.getSkipApproval(item.backstageKey[0].keyName) == 'true' ? true : false ;
						}else if(item.type == 'table'){
							// ---------- 改变单选多选的赋值方式
							item.operationType == 'radio' ? item.value = "" : item.value = [];
						}
					});
				} 
				this.formData = data;  
			 },
			/* 获取组件返回回来的数据 */
			_obtainFormData(option){ 
				var activeTreeKey = uni.getStorageSync('activeTreeKey');
				this.submitForm[activeTreeKey] = option[activeTreeKey];
				this.showLabelForm[activeTreeKey] = option[activeTreeKey +'label'];
			},
			/* 提交表单 */
			formSubmit(e) {  
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
			},
			showTree(item){  
				this.showTreeId = item.id;
				this.isShowTree = true; 
			},
			/* picker点击确认按钮时保存日期 */
			onDateConfirm(e) {  
				this.submitForm[this.activeKey] = new Date(e.checkArr.join("-")).getTime(); 
				this.submitForm = Object.assign({}, this.submitForm, this.submitForm);
			},  
			showPicker(item){   
				this.activeKey = item.backstageKey[0].keyName;
				this.$refs.picker1.show();
			},
			/* 点击提交附件 */
			clickUpload(item){   
				uni.chooseImage({
					success: (chooseImageRes) => { 
						var orgId = uni.getStorageSync('userInfo').orgId;
						item.requestUrl = chooseImageRes.tempFilePaths[0];
						item = Object.assign({}, item, item);
						var data = {
							filePath: item.requestUrl,
							taskId:   orgId,
						}
						this.$mainUtils.Upload(data, res => {
							if(res.data) {
								item.value.push({fileId: JSON.parse(res.data).data, fileName: item.requestUrl, name: item.requestUrl}); 
							}
						})
					}
				});
			},
			/* 文本改变时赋值 */
			inputKeyUp(ev,item){ 
				// item.value = ev.detail.value;
				this.submitForm[item.backstageKey[0].keyName] = ev.detail.value;
				this.submitForm = Object.assign({}, this.submitForm, this.submitForm);
			},
			/* 获取树组件返回回来的数据 */
			treeValDataFun(data, item){  
				this.isShowTree = false;
				this.submitForm[item.backstageKey[0].keyName] = data.value;
				this.showLabelForm[item.backstageKey[0].keyName] = data.label;
				
				if(item.backstageKey[0].keyName == "nextAssignee"){ //最后一个清空数据
					this.submitForm.nextAssigneeOrg = null;
					this.showLabelForm.nextAssigneeOrg = '';
				}else if(item.backstageKey[0].keyName == "nextAssigneeOrg"){ //倒数第二个清空数据
					this.submitForm.nextAssignee = null;
					this.showLabelForm.nextAssignee = '';

				}
			},
			/*
			 * 保存数据
			 * @params {object} data 按钮数据
			 * @params {string} formNamvare 表单Name
			 */
			saveForm(data, formName) {  
				if(this.taskDetail.formTypeT ? this.taskDetail.formTypeT == 'metting' : ''){
					this.submitForm.meetingId = taskDetail.id; 
				}else{
					this.submitForm.taskId = this.taskDetail.taskVoList[0].processTaskId;
					this.submitForm.instanceId = this.taskDetail.id; 
					this.submitForm.formData = JSON.stringify(this.formData);  
					this.submitForm.typeId = this.taskType; 
					this.submitForm.parentTaskId = this.parentTaskId;
				} 
				this.$mainUtils.request(data.requestUrl, this.submitForm, data.requestMethod, res => { 
					if(res != 'undefined'){
						uni.showToast({
							title: '保存成功！',
							duration: 500,
							mask: true,
							icon: 'none'
						});
						setTimeout( ()=> {
							let url ;
							if(this.taskDetail.formTypeT ? this.taskDetail.formTypeT == 'metting' : ''){
								url = '/pages/mine/meeting/meeting-detail?meetingId=' + this.taskDetail.id;
							}else{
								url = '/pages/mine/task-detail?taskId=' + this.taskDetail.id;
							}
							uni.navigateTo({
								url: '/pages/mine/task-detail?taskId=' + this.taskDetail.id
							}) 
						},530)
						
					}
					
				}) 
			 }, 
			radioChange(ev,item){ 
				item.value = ev.detail.value;
			},
			checkboxChange(ev,item){ 
				item.value = [];
				ev.detail.value.forEach( (val) => {
					item.value.push(val);
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
	.uni-list-cell::after {
			position: absolute;
			z-index: 3;
			right: 0;
			bottom: 0;
			left: 16px;
			height: 1px;
			content: '';
			-webkit-transform: scaleY(.5);
			-ms-transform: scaleY(.5);
			transform: scaleY(.5);
			background-color: #c8c7cc;
	}
</style>