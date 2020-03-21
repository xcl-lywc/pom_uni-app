<template>
  <view class="uni-pad-30 backgroundFFF" style="height: calc(100vh - 148upx);">
  	<text v-if="paperDetailData.requirement">{{paperDetailData.requirement}}</text>
  </view>
</template>

<script>
  
  export default {
    data() {
      return {
        paperDetailData: {}
      }
    },
    onLoad(option) {
      this.getPaperDetail(option.id)
    },
    methods: {
      getPaperDetail(id) {
        this.$mainUtils.request("/test_papers/test_papers/details", {id: id}, 'GET', res => {
          if (res) {
            this.paperDetailData = res
          }
        });
      },
    }
  }
</script>

<style>
</style>
