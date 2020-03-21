<template>
  <view class="padding20">
    {{detailData.periodIntroduction}}
  </view>
</template>

<script>
  
  export default {
    data() {
      return {
        detailData: {
        }
      }
    },
    onLoad(option) {
      this.getDetail(option.id)
    },
    methods: {
      /**
       * 获取当前课时详情
       */
      getDetail(id) {
        this.$mainUtils.request("l_lecture/period/"+id, null, 'GET', res => {
          if (res) {
            this.detailData = res
          }
        });
      },
    }
  }
</script>

<style>
</style>
