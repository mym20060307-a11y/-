<template>
  <header class="bg-white shadow h-16 flex items-center justify-between px-6 z-10 relative">
    <div class="flex items-center">
      <h1 class="text-xl font-bold text-gray-800">城市公交管理系统</h1>
    </div>
    <div class="flex items-center space-x-4">
      <span class="text-gray-600">欢迎, {{ authStore.user?.name }}</span>
      <el-button link type="primary" @click="handleLogout">退出</el-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
