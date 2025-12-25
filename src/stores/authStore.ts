import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api';
import type { User } from '../types';
import { ElMessage } from 'element-plus';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const isAuthenticated = computed(() => !!token.value);
  const router = useRouter();

  // Load user from storage if available
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);
      user.value = response.user;
      token.value = response.token;
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      ElMessage.success('登录成功');
      return true;
    } catch (error) {
      ElMessage.error('登录失败：' + (error as Error).message);
      return false;
    }
  };

  const logout = async () => {
    await api.auth.logout();
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    ElMessage.success('已退出登录');
    // Note: Router redirection should be handled in the component calling this action or via router guard
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  };
});
