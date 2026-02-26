<template>
  <div class="login-container">
    <div class="login-content">
      <a-card class="login-card" :bordered="false">
        <slot></slot>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  /* 容器：全屏背景，Flex居中 */
  .login-container {
    min-height: 100vh;
    width: 100%;
    background: #f0f2f5;
    background-image: url('@/assets/images/login-bg.svg');
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  .login-content {
    width: 100%;
    max-width: 480px;
    padding: 20px;
  }

  /* 卡片样式 */
  .login-card {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    padding: 10px 10px 30px 10px;
  }
</style>
