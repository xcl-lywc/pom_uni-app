<template>
  <view class="uni-pad-30 backgroundFFF" style="height: calc(100vh - 148upx);">
    <!-- <list> -->
      <list-item v-for="(item, index) in paperDetailData.treeList" :title="item.name"></list-item>
    <!-- </list> -->
  </view>
</template>

<script>
  import list from "@/components/uni-list/uni-list.vue"
  import listItem from "@/components/uni-list-item/uni-list-item.vue"
  export default {
    data() {
      return {
        paperDetailData: {
          treeList: []
        }
      }
    },
    components: {
      list, listItem
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
