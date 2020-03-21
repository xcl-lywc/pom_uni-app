/*************************************
*  create by xieyuanyuan date 2018/08/03
*  导出结果组件
**************************************/
<template>
  <button type="primary" size="mini" @click="resultDownload">导出结果</button>
</template>
<script>
  export default {
    props:{
      itemParams: {  
          required: true,
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
          jsonData: null,
        }
    },
    mounted() {
    },
    watch:{
    },
    destoryed() {

    },
    methods:{
      /*
       * 导出投票结果
       */
      resultDownload() { 	
				uni.downloadFile({
					url: this.itemParams.requestUrl,
					data: this._resultDownloadParams(),
					success: (res) => { 
						uni.showToast({
							title: '成功!',
							duration: 2000,
							mask: true,
							icon: 'none'
						})
					}
				})
// 				this.$mainUtils.request(this.itemParams.requestUrl, this._resultDownloadParams(), 'GET', res => {
// 					 this.tableData = res;
// 				});  
       },
      _resultDownloadParams(){
        return {  
					taskId:     this.taskId,
					instanceId: this.instanceId, 
         }
       },
    }
  }
</script>