<template>
  <div class="p-6 h-full flex flex-col">
    <h2 class="text-2xl font-bold mb-6">实时监控</h2>
    <div class="flex-1 bg-gray-200 relative rounded-lg overflow-hidden border border-gray-300">
      <!-- Simulated Map Background -->
      <div class="absolute inset-0 bg-slate-100 flex items-center justify-center text-gray-400">
        <div class="grid grid-cols-12 grid-rows-12 gap-4 w-full h-full opacity-20">
          <div v-for="n in 144" :key="n" class="border border-gray-300"></div>
        </div>
        <span class="absolute text-4xl font-bold opacity-10">MAP PLACEHOLDER</span>
      </div>

      <!-- Bus Markers -->
      <div
        v-for="bus in buses"
        :key="bus.id"
        class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ease-in-out"
        :style="{ left: getRelativeX(bus.current_location.lng) + '%', top: getRelativeY(bus.current_location.lat) + '%' }"
      >
        <el-popover placement="top" :width="200" trigger="hover">
          <template #reference>
            <div class="flex flex-col items-center">
              <el-icon :size="24" :color="bus.status === 'operational' ? '#67C23A' : '#F56C6C'">
                <Location />
              </el-icon>
              <span class="text-xs font-bold bg-white px-1 rounded shadow">{{ bus.bus_number }}</span>
            </div>
          </template>
          <div>
            <p><strong>车牌:</strong> {{ bus.plate_number }}</p>
            <p><strong>线路:</strong> {{ getRouteName(bus.route_id) }}</p>
            <p><strong>速度:</strong> {{ Math.floor(Math.random() * 40 + 20) }} km/h</p>
            <p><strong>状态:</strong> {{ bus.status === 'operational' ? '正常运行' : '异常' }}</p>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { api } from '../../api';
import type { Bus, Route } from '../../types';

const buses = ref<Bus[]>([]);
const routes = ref<Route[]>([]);
let intervalId: any;

// Mock map bounds for demo (Guangzhou roughly)
const BOUNDS = {
  minLat: 23.1000,
  maxLat: 23.1500,
  minLng: 113.2000,
  maxLng: 113.3500
};

const getRelativeX = (lng: number) => {
  return ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
};

const getRelativeY = (lat: number) => {
  // Map Y is inverted (top is 0) relative to Latitude (top is higher)
  // So 100% - normalized lat
  return 100 - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
};

const getRouteName = (routeId?: number) => {
  if (!routeId) return '未知';
  const route = routes.value.find(r => r.id === routeId);
  return route ? route.route_number : '未知';
};

const updateLocations = () => {
  // Simulate movement
  buses.value = buses.value.map(bus => {
    if (bus.status !== 'operational') return bus;
    
    // Random small movement
    const latMove = (Math.random() - 0.5) * 0.002;
    const lngMove = (Math.random() - 0.5) * 0.002;
    
    let newLat = bus.current_location.lat + latMove;
    let newLng = bus.current_location.lng + lngMove;

    // Keep in bounds
    if (newLat < BOUNDS.minLat) newLat = BOUNDS.minLat;
    if (newLat > BOUNDS.maxLat) newLat = BOUNDS.maxLat;
    if (newLng < BOUNDS.minLng) newLng = BOUNDS.minLng;
    if (newLng > BOUNDS.maxLng) newLng = BOUNDS.maxLng;

    return {
      ...bus,
      current_location: {
        lat: newLat,
        lng: newLng
      }
    };
  });
};

onMounted(async () => {
  const [busesData, routesData] = await Promise.all([
    api.buses.getAll(),
    api.routes.getAll()
  ]);
  buses.value = busesData;
  routes.value = routesData;

  // Start simulation
  intervalId = setInterval(updateLocations, 2000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
