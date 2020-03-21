/*************************************
*  create by xieyuanyuan date 2018/05/11
*  查询附件组件
**************************************/
<template>
  <view>
		
  </view>
</template>
<script>

  export default {
    props:{
      params: {  
          required: true,
      },
      taskId: {  
          required: true,
      },   
    },
    data() {
        return { 
          orgId: uni.getStorageSync('userInfo').partyOrgId,
          fileList: [],
        }
    },
    mounted() {
      this.getFileList();
    },
    watch: {
    },
    destoryed() {

    },
    methods: {
      /*
       * 查询表单数据
       */
      getFileList() {
				this.$mainUtils.request(this.params.requestUrl, this._getTableDataParams(), 'GET', res => {
					if(res){
						this.fileList = response.data.data;
						this.$emit('dataList', this.fileList);
					}
				})  
       },
      _getTableDataParams(){
        return { 
					taskId:     this.taskId, 
         }
       },
      /*
       * 上传附件之前
       */
      handleAvatarSuccess(res, file, beforeFile){
        // beforeFile.fileName = file.name;
        res.meta.code == 0 ? this.$message.success('修改成功！') : this.$message.error(res.meta.message)
      }
    }
  }
</script>