<template>
  <a-config-provider :locale="zhCN">
    <GlobalLoading :show="loading"></GlobalLoading>
    <RouterView />
  </a-config-provider>
</template>

<script lang="tsx" setup>
  import { RouterView } from 'vue-router';
  import { message, Modal } from 'ant-design-vue';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import dayjs from 'dayjs';
  import 'dayjs/locale/zh-cn';

  import GlobalLoading from '@/components/GlobalLoading.vue';
  import { globalLoading } from '@/components/globalLoading';
  const loading = globalLoading.loading;

  window.$message = message;
  window.$modal = Modal;
</script>

<style></style>
