/*************************************
*  create by xieyuanyuan date 2018/09/06
*  显示树形下拉
**************************************/
<template>
  <view class="my-tree">  
		<view class="view-ul">
			<!-- 当是最后一层，并且没有人员数据的情况下，就将箭头给去掉 -->
		 <view class="view-li" :class="{'last-li' : !(item.atypes ? item.atypes.length : false) }" v-for="(item, index) in treeData" :key="index" >
			<view class="view-arrow" @click="showChildren(item)">
				<text class="arrow" :class="{'bottom-arrow': item.isShow}"></text> 
			</view> 
			<radio :value="item.atId" >{{item.atName}}</radio>  
			<items v-show="item.atypes && item.isShow" :treeData="item.atypes" ></items> 
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
    },
    data() {
      return {   
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