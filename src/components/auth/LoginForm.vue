<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50 h-screen items-center">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        公交车管理系统登录
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <el-form :model="form" label-width="0" class="space-y-6" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input v-model="form.email" placeholder="邮箱" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <div>
          <el-button
            type="primary"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            :loading="loading"
            @click="handleLogin"
            size="large"
          >
            登录
          </el-button>
        </div>
        
        <div class="text-sm text-center text-gray-500 mt-4">
          <p>测试账号: admin@bus.com / password</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: 'admin@bus.com',
  password: 'password'
});

const loading = ref(false);

const handleLogin = async () => {
  if (!form.email || !form.password) return;
  
  loading.value = true;
  const success = await authStore.login(form.email, form.password);
  loading.value = false;
  
  if (success) {
    router.push('/dashboard');
  }
};
</script>
