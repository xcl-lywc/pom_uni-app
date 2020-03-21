<template>
	<view>  
		<!-- 编辑表格时显示 -->
		<scroll-view class="scroll-view_H marl15" scroll-x="true" >
			<!-- 多选 -->
			<checkbox-group @change="checkboxChange" v-if="tableParams.isOperation && tableParams.operationType == 'checkbox'">
				<view class="scroll-view_B">
					<view v-for="(item, index) in tableParams.cols" :key="index"  class="scroll-view-item_H">
						<view class="scroll-view-item_T scroll-view-item_header"> 
							{{item.name}}
						</view>
						<view v-for="(itemVal, indexVal) in tableData" :key="indexVal" class="scroll-view-item_T">
							<checkbox :value="itemVal.questionId ? itemVal.questionId : itemVal.id" v-if="index == 0 && tableParams.isOperation && tableParams.operationType == 'checkbox'" ></checkbox> 
							{{itemVal[item.keyName]}}
						</view>
					</view>
				</view>  
			</checkbox-group>
			<!-- 单选 -->
			<radio-group @change="radioChange" v-if="tableParams.isOperation && tableParams.operationType == 'radio'">
				<view class="scroll-view_B">
					<view v-for="(item, index) in tableParams.cols" :key="index"  class="scroll-view-item_H">
						<view class="scroll-view-item_T scroll-view-item_header"> 
							{{item.name}}
						</view>
						<view v-for="(itemVal, indexVal) in tableData" :key="indexVal" class="scroll-view-item_T"> 
							<radio :value="itemVal.questionId ? itemVal.questionId : itemVal.id" v-if="index == 0 && tableParams.isOperation && tableParams.operationType == 'radio'" ></radio> 
							{{itemVal[item.keyName]}} 
						</view>
					</view>
				</view>  
			</radio-group>
			<!-- 无选项 -->
			<view v-if="!tableParams.isOperation" class="scroll-view_B">
				<view v-for="(item, index) in tableParams.cols" :key="index"  class="scroll-view-item_H">
					<view class="scroll-view-item_T scroll-view-item_header"> 
						{{item.name}}
					</view>
					<view v-for="(itemVal, indexVal) in tableData" :key="indexVal" class="scroll-view-item_T">  
						{{itemVal[item.keyName]}} 
					</view>
				</view>
			</view>  
			<!-- 历史记录显示 -->
			<table class="table-border-com" v-if="tableParams.isShowHeader" style="width: 100%">
				<tr>
					<th v-for="(item, index) in tableParams.cols"
						:key="index">{{item.name}}</th>
				</tr>
			</table>
		</scroll-view>
	</view>
</template>
<script>
  export default {
    props:{
      tableParams: {  
          required: true,
          // default: [],
      },
      taskId: {        
          required: true,
      },
      instanceId: {   
          required: true,
      }, 
    },
    data() {
        return {
          tableData: [],
          value: [],
        }
    },
    mounted() {
      // ---- 当不只是显示表头的时候才会查询数据 
      if(!this.tableParams.isShowHeader) this.getTableData();
    },
    watch:{
    },
    destoryed() {

    },
    methods:{
      /*
       * 查询表格数据
       */
      getTableData() {
        // -------------- 箭头函数没有自己的this，它继承的是父执行上下文里面的this
        this.$mainUtils.request(this.tableParams.requestUrl, this._getTableDataParams(), 'GET', res => {
				  this.tableData = res;
				}); 
       },
      _getTableDataParams(){
        return {
          taskId:       this.taskId,
          instanceId:   this.instanceId,
         }
       },
       /*
        * 转换数据
        * @params {object} item 表头数据
        * @params {object} row 当前行数据
        */
       _convertValue(item, row){
        if(item.dataType == 'text'){ //文本
          return row[item.keyName];
        }else if(item.dataType == 'controlTable'){ //对照表
          return this.$util.controlTable(row[item.keyName])
        }else{ //时间
          return this.$util._convertDate(row[item.keyName], item.dataType);
        }
       },
      checkboxChange(val){  
        this.tableParams.value = []; 
        val.detail.value.forEach((item) => {
          this.tableParams.value.push( item ? parseInt(item) : '');
        }) 
      },
			radioChange(val){ 
				this.tableParams.value = val.detail.value ? parseInt(val.detail.value) : '';
			}
    }
  }
</script>
<style type="text/css">
  .table-border-com th{
    border: 1px solid #ececec;
  }
	.scroll-view_H{ 
		width: 93%;
		white-space: nowrap;
		
	}
	.scroll-view_B{
		border-right: 1px solid #ebeef5;
		width: min-content;
	}
	.scroll-view-item_H {
		min-width: 120upx; 
		display: inline-block; 
		border-bottom: 1px solid #ebeef5;
	}
	.scroll-view-item_T{
		text-align: center;
		border: 1px solid #ebeef5;
		border-bottom: none;
		border-right: none;
		padding: 20upx;
	}
	.scroll-view-item_header{
		color: #909399;
		background: #FAFAFA;
	}
</style>