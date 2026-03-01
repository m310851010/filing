<template>
  <a-layout style="padding-top: 60px; height: 100%;" >
    <div class="header-container">
      <div   class="flex-main text-center" style="font-size: 26px; font-weight: bold;">数据填报辅助工具</div>
      <div class="layout-header-action">
        <a-dropdown class="header-action-item" trigger="hover">
          <div @click.prevent>
            {{ userName }}
            <down-outlined style="margin-left: 8px" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="outLogin" @click="handleOutLogin">
                <export-outlined class="mr-10" />
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <a-layout-content class="content">
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="['setting']">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </router-view>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router';
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import {  DownOutlined, ExportOutlined } from '@ant-design/icons-vue';
  import { userService } from '@/hook/user.service';
  import { Modal } from 'ant-design-vue';

  // 菜单
  const menus = ref([
    { name: '数据导入及校验', path: '/main/data-check', disabled: false },
    { name: '数据校验配置', path: '/main/data-check-config', disabled: false }
  ]);

  // 选中的菜单
  const selectedKeys = computed(() => [route.path]);
  const route = useRoute();
  const $router = useRouter();

  const userName = ref('');
  userService.getUserInfo().subscribe(userInfo => {
    userName.value = userInfo.name || userInfo.username || '';
  });

  // 退出登录
  const handleOutLogin = () => {
    Modal.confirm({
      title: '提示',
      content: '确认退出当前用户？',
      okText: '确认',
      onOk: () => {
        userService.logout().subscribe(() => {
          window.location.reload();
        });
      }
    });
  };
</script>

<style scoped>
  .header-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 48px;
    line-height: 48px;
    background: #fff;
    width: 100%;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .layout-header-action {
    display: flex;
    align-items: center;
    margin-right: 20px;
    white-space: nowrap;
  }

  .header-action-item {
    display: flex;
    height: 100%;
    padding: 0 10px;
    cursor: pointer;
    align-items: center;
    &:not(.clear-hover):hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }
</style>
