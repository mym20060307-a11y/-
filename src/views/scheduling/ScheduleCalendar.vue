<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">排班调度</h2>
      <el-button type="primary" icon="Plus" @click="handleCreate">新增排班</el-button>
    </div>

    <el-card shadow="never">
      <el-calendar>
        <template #date-cell="{ data }">
          <div class="h-full" @click="handleDateClick(data.day)">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').slice(1).join('-') }}
              {{ data.isSelected ? '✔️' : '' }}
            </p>
            <div v-for="schedule in getSchedulesForDate(data.day)" :key="schedule.id" class="text-xs mt-1">
              <el-tag size="small" :type="getShiftType(schedule.shift_type)" class="mb-1 block">
                {{ getRouteName(schedule.route_id) }} - {{ schedule.departure_time }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-card>

    <!-- Create Dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="新增排班"
      width="500px"
    >
      <el-form :model="formData" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="日期" prop="schedule_date">
          <el-date-picker
            v-model="formData.schedule_date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="线路" prop="route_id">
          <el-select v-model="formData.route_id" placeholder="选择线路">
            <el-option
              v-for="route in routes"
              :key="route.id"
              :label="route.route_number + ' - ' + route.route_name"
              :value="route.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="车辆" prop="bus_id">
          <el-select v-model="formData.bus_id" placeholder="选择车辆">
            <el-option
              v-for="bus in buses"
              :key="bus.id"
              :label="bus.bus_number + ' (' + bus.plate_number + ')'"
              :value="bus.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="司机" prop="driver_id">
          <el-select v-model="formData.driver_id" placeholder="选择司机">
            <el-option
              v-for="driver in drivers"
              :key="driver.id"
              :label="driver.driver_name"
              :value="driver.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发车时间" prop="departure_time">
          <el-time-picker
            v-model="formData.departure_time"
            placeholder="选择时间"
            value-format="HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="预计到达" prop="arrival_time">
          <el-time-picker
            v-model="formData.arrival_time"
            placeholder="选择时间"
            value-format="HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="班次类型" prop="shift_type">
          <el-select v-model="formData.shift_type">
            <el-option label="早班" value="morning" />
            <el-option label="午班" value="afternoon" />
            <el-option label="晚班" value="evening" />
            <el-option label="夜班" value="night" />
            <el-option label="正常" value="normal" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../api';
import type { Schedule, Route, Bus, Driver } from '../../types';

const schedules = ref<Schedule[]>([]);
const routes = ref<Route[]>([]);
const buses = ref<Bus[]>([]);
const drivers = ref<Driver[]>([]);

const dialogVisible = ref(false);
const submitting = ref(false);
const formRef = ref();

const formData = reactive<Partial<Schedule>>({
  schedule_date: '',
  route_id: undefined,
  bus_id: undefined,
  driver_id: undefined,
  departure_time: '',
  arrival_time: '',
  shift_type: 'morning',
  status: 'scheduled'
});

const rules = {
  schedule_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  route_id: [{ required: true, message: '请选择线路', trigger: 'change' }],
  bus_id: [{ required: true, message: '请选择车辆', trigger: 'change' }],
  driver_id: [{ required: true, message: '请选择司机', trigger: 'change' }],
  departure_time: [{ required: true, message: '请选择发车时间', trigger: 'change' }]
};

const getSchedulesForDate = (day: string) => {
  return schedules.value.filter(s => s.schedule_date === day);
};

const getRouteName = (routeId: number) => {
  const route = routes.value.find(r => r.id === routeId);
  return route ? route.route_number : '未知线路';
};

const getShiftType = (type: string) => {
  const map: Record<string, string> = {
    morning: 'success',
    afternoon: 'warning',
    evening: 'danger',
    night: 'info',
    normal: ''
  };
  return map[type] || '';
};

const fetchAllData = async () => {
  const [schedulesData, routesData, busesData, driversData] = await Promise.all([
    api.schedules.getAll(),
    api.routes.getAll(),
    api.buses.getAll(),
    api.drivers.getAll()
  ]);
  schedules.value = schedulesData;
  routes.value = routesData;
  buses.value = busesData;
  drivers.value = driversData;
};

const handleCreate = () => {
  Object.assign(formData, {
    id: 0,
    schedule_date: new Date().toISOString().split('T')[0],
    route_id: undefined,
    bus_id: undefined,
    driver_id: undefined,
    departure_time: '',
    arrival_time: '',
    shift_type: 'morning',
    status: 'scheduled'
  });
  dialogVisible.value = true;
};

const handleDateClick = (day: string) => {
  // Optional: Open create dialog pre-filled with this date
  // handleCreate();
  // formData.schedule_date = day;
};

const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true;
      try {
        // @ts-ignore
        await api.schedules.create(formData);
        ElMessage.success('排班创建成功');
        dialogVisible.value = false;
        // Refresh schedules
        schedules.value = await api.schedules.getAll();
      } catch (error) {
        ElMessage.error('操作失败');
      } finally {
        submitting.value = false;
      }
    }
  });
};

onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
.is-selected {
  color: #1989fa;
}
</style>
