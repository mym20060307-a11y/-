<template>
  <el-aside width="240px" class="bg-slate-800 text-white min-h-screen flex flex-col">
    <div class="p-4 flex items-center justify-center border-b border-slate-700">
      <span class="text-xl font-bold text-white">公交管理</span>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo border-r-0 bg-slate-800"
      background-color="#1e293b"
      text-color="#94a3b8"
      active-text-color="#fff"
      router
    >
      <el-menu-item index="/dashboard">
        <span>系统主页</span>
      </el-menu-item>
      
      <el-menu-item index="/routes">
        <span>线路管理</span>
      </el-menu-item>
      
      <el-menu-item index="/buses">
        <span>车辆管理</span>
      </el-menu-item>
      
      <el-menu-item index="/drivers">
        <span>司机管理</span>
      </el-menu-item>
      
      <el-menu-item index="/scheduling">
        <span>排班调度</span>
      </el-menu-item>
      
      <el-menu-item index="/monitoring">
        <span>实时监控</span>
      </el-menu-item>
      
      <el-menu-item index="/statistics">
        <span>统计分析</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeMenu = computed(() => route.path);
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}
</style>
