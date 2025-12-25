<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">欢迎使用公交车管理系统</h1>
    <p>当前登录用户: {{ authStore.user?.name }} ({{ authStore.user?.role }})</p>
    <el-button type="danger" @click="handleLogout" class="mt-4">退出登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
