/*************************************
*  create by xieyuanyuan date 2018/09/06
*  查询树形下拉
**************************************/
<template>
  <view class="my-tree-bar" v-if="paramsData">   
    <!-- 多选组合框 -->
    <checkbox-group  v-if="paramsData.isCheckbox == 0" 
      class="my-tree-bar"  
      @change="handleCheckedValueChange"> 
        <show-tree-selected-last  
          :treeData="treeData" 
					:paramsData="paramsData"
          layer="1"  ></show-tree-selected-last>
    </checkbox-group>
    <!-- 单选组合框 -->
    <radio-group  
      v-if="paramsData.isCheckbox == 1" 
      class="my-tree-bar" 
      v-model="checkedValue" 
      @change="handleCheckedValueChange"> 
        <show-tree-selected-last  
          :treeData="treeData" 
					:paramsData="paramsData"
          layer="1" ></show-tree-selected-last>
    </radio-group>
		<button type="primary" @tap="submitMember">提交</button>
  </view>
</template>
<script>
  import Show_Tree_Selected_Last  from './tree-last.vue'
  export default { 
    name: 'items',
    components: {
      'show-tree-selected-last': Show_Tree_Selected_Last
    },
		props:{   
      paramsData: {     
        default: null,
      }, 
		},
    onLoad(option) {  
    },
		mounted() {  
			this.getQueryData(this.paramsData.requestUrl);
		},
    data() {
      return { 
        orgId:  			 this.pageType == 'org' ? sessionStorage.getItem('orgId') : '',
        treeData:      null,   
        checkedValue:  [], //被选中人员数组
				isCheckbox:    null,
				value:  			 null, //选中的值
				title: 				 null, //头部标题
				checkboxType:  null, //是否每层都需要显示
				backstageKey:  null, //提交到后台的key
      }
    },
    onNavigationBarButtonTap(e){  
			if(!this.checkedValue.length) {
				uni.showToast({
					title: "请选择"+this.title, 
					duration: 2000,
					mask: true,
					icon: 'none'
				});
				return false;
			}  
    },
    methods:{
			getQueryUserData(){ 
				var convertCheckValue = [];
				/* 将字符转为数字 */
				this.checkedValue.forEach( (item) => {
					convertCheckValue.push(parseInt(item));
				}) 
				var url = '/hr_users/simple/list';
				var param = {userIds: convertCheckValue};
				if(this.paramsData.backstageKey[0].keyName == 'nextAssigneeOrg') {
					url = 'party_mem_positions/simple/user'; 
					param = {partyPositionId: convertCheckValue};
				} 
				this.$mainUtils.request(url, param, 'POST', (res) => {  
					if(res){ 
						var userNames = [];
						res.forEach( (item) => {
							userNames.push(item.name);
						}); 
						this.$emit('treeValData', {value: convertCheckValue,label: userNames.join(',')});
						
					} 
				})   
			},
      /*
       * 查询数据
       */
      getQueryData(requestUrl) {  
				this.$mainUtils.request(requestUrl, {}, 'get', (res) => {
					this.treeData = this._convertData(res ? res : []);
				})  
       },
      _convertData(data){ 
        data.forEach((item) => {
          item.isShow = false; 
          if(item.childrens) this._convertData(item.childrens);  
        })
        return data;
      },
      handleCheckedValueChange(data){   
				this.checkedValue =  typeof data.detail.value == 'string' ? [data.detail.value] : data.detail.value;
      },
			submitMember(){
				if(!this.checkedValue.length) {
					uni.showToast({
						title:	'请勾选数据！',
						duration:		1000,
						mask:true,
						icon:	'none',
					})
					return false;
				}
				this.getQueryUserData()
			}
    }
  }
</script>
<style lang="scss">
	/*自定义的树形下拉*/
.my-tree-bar{ 
	margin: 30upx;
  .my-tree{
    ul{ 
      li{
        cursor: pointer;
        font-size: 12px;
        transform: rotate(0deg);
        transition: transform .3s ease-in-out;
        line-height: 26px;
        font-size: 14px!important;
        position: relative;
        padding-left: 14px;
        .arrow{ 
          border: 5px solid transparent;
          border-color: transparent transparent transparent #c0c4cc;
          height: 0;
          width: 0;
          display: inline-block;
          position: absolute;
          left: 0;
          top: 8px;
          transition: all .3s;
        }
        .bottom-arrow{
          transform: rotate(90deg); 
        }
      }
      
      .last-li{
        .arrow{
          border:none !important;
        }
        
      }
    }
    .hide{
      opacity: 0;
    }
    .show{
      opacity: 1;
    }
  }
}
</style>