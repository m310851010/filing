<template>
  <div v-if="show" class="loading-box">
    <div class="mask"></div>
    <div class="loading-content-box">
      <a-spin :show="show" size="small">
        <template #description>
          <div class="tip">处理中...</div>
        </template>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    show: Boolean
  });
</script>
<style lang="less" scoped>
  .loading-box {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 999999;
    .a-spin {
      color: #ccc;
    }
    .mask {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.5);
    }
    .loading-content-box {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .tip {
      font-size: 14px;
      margin-top: 8px;
    }
  }
</style>
