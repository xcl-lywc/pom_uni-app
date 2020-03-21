/*************************************
*  create by xieyuanyuan date 2018/09/06
*  显示树形下拉
**************************************/
<template>
  <view class="my-tree" v-if="paramsData">  
		<view class="view-ul">
			<!-- 当是最后一层，并且没有人员数据的情况下，就将箭头给去掉 -->
		 <view class="view-li" :class="{'last-li' : !(item.childrens ? item.childrens.length : false) && !(item.partyMem ? item.partyMem.length : false)}" v-for="(item, index) in treeData" :key="index" >
			<view class="view-arrow" @click="showChildren(item)">
				<text class="arrow" :class="{'bottom-arrow': item.isShow}"></text>
				<text v-show="paramsData.checkboxType != true">{{item.name}}</text>
			</view>
			<!-- paramsData.checkboxType 类型为true表示每层都需要显示 -->
			<checkbox 
				v-if="paramsData.isCheckbox == 0"
				v-show="paramsData.checkboxType == true"  
				:value="item.id.toString()" >{{item.name}}</checkbox>
			 <radio 
				v-if="paramsData.isCheckbox == 1" 
				v-show="paramsData.checkboxType == true" 
				:value="item.id.toString()" >{{item.name}}</radio>

			<items v-show="item.childrens && item.isShow"  
					:treeData="item.childrens" 
					:paramsData="paramsData" ></items>
			 <!-- 显示人员选项 -->
			 <view class="my-tree view-ul" v-show="item.partyMem && item.isShow">
					<view class="last-li view-li" v-for="(itempartyMem, indexpartyMem) in item.partyMem" :key="indexpartyMem">
						<checkbox v-if="paramsData.isCheckbox == 0" :value="itempartyMem.id.toString()">{{itempartyMem.name}}</checkbox>
						<radio v-if="paramsData.isCheckbox == 1" :value="itempartyMem.id.toString()">{{itempartyMem.name}}</radio>
					</view>
			 </view>
		 </view>
	 </view>
  </view>
</template>
<script>
  import items  from './tree-last.vue'
  export default {
    name: 'items',
    props:{
      treeData:   null, //树结构数据
      layer:      null, //第几层
      paramsData: {     
        default: null,
      }, //需要参数 
    },
    data() {
      return {  
        checkedCities: null,
      }
    },
    mounted() {
       
    },
    watch:{
    },
    destoryed() {

    },
    methods:{
      showChildren(item){  
        item.isShow = !item.isShow;
      },
    }
  }
</script>
<style lang="scss">
/*自定义的树形下拉*/
.my-tree-bar{ 
  .my-tree{ 
    .view-ul{ 
      .view-li{
        cursor: pointer;
        font-size: 24upx;
        transform: rotate(0deg);
        transition: transform .3s ease-in-out;
        line-height: 52upx;
        font-size: 28upx!important;
        position: relative;
        padding-left: 28upx;
        .arrow{ 
          border: 16upx solid transparent;
          border-color: transparent transparent transparent #c0c4cc;
          height: 0;
          width: 0;
          display: inline-block;
          position: absolute;
          left: 0;
          top: 16upx;
          transition: all .3s;
        }
        .bottom-arrow{
          transform: rotate(90deg); 
					left: -12upx;
        }
      }
			.view-arrow{
				
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