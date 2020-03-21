<template>
  <view>
    <cmd-cell-item v-for="(item, index) in detailData.knowList" :title="item.name"></cmd-cell-item>
  </view>
</template>

<script>
  import cmdCellItem from '@/components/cmd-cell-item/cmd-cell-item.vue'
  export default {
    components: { cmdCellItem },
    data() {
      return {
        detailData: {
          knowList: []
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
