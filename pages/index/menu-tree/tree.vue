/*************************************
*  create by xieyuanyuan date 2018/09/06
*  查询树形下拉
**************************************/
<template>
  <view class="my-tree-bar">    
    <!-- 单选组合框 -->
    <radio-group   
      class="my-tree-bar" 
      v-model="checkedValue" 
      @change="handleCheckedValueChange"> 
        <show-tree-selected-last  
          :treeData="treeData"  
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
			this.getQueryData();
		},
    data() {
      return {  
        treeData:      null,   
        checkedValue:  [], //被选中人员数组
				isCheckbox:    null,
				value:  			 null, //选中的值
				title: 				 null, //头部标题
				checkboxType:  null, //是否每层都需要显示
				backstageKey:  null, //提交到后台的key
      }
    }, 
    methods:{
			getQueryTypeDetail(){  
				this.$mainUtils.request("/a_types/atypestree/from_org/"+uni.getStorageSync('userInfo').committeeCode, {id: this.checkedValue}, 'get', (res) => {
					this.$emit('treeData', res)
				})  
			},
      /*
       * 查询数据
       */
      getQueryData(requestUrl) {  
				this.$mainUtils.request("/a_types/allarticletypes/from_org/"+uni.getStorageSync('userInfo').committeeCode, {}, 'get', (res) => {
					this.treeData = this._convertData(res ? res : []);
				})  
       },
      _convertData(data){  
        data.forEach((item) => {
          item.isShow = false; 
          if(item.atypes) this._convertData(item.atypes);  
        })
        return data;
      },
      handleCheckedValueChange(data){   
				this.checkedValue =  data.detail.value;
      },
			submitMember(){
				if(!this.checkedValue) {
					uni.showToast({
						title:	'请勾选数据！',
						duration:		1000,
						mask:true,
						icon:	'none',
					})
					return false;
				}
				this.getQueryTypeDetail()
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