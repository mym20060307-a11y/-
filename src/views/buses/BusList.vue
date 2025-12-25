<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">车辆管理</h2>
      <el-button type="primary" icon="Plus" @click="handleCreate">新增车辆</el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="buses" style="width: 100%" v-loading="loading">
        <el-table-column prop="bus_number" label="车辆编号" width="120" />
        <el-table-column prop="plate_number" label="车牌号" width="120" />
        <el-table-column prop="model" label="车型" width="150" />
        <el-table-column prop="capacity" label="核载人数" width="100" />
        <el-table-column prop="fuel_type" label="能源类型" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.fuel_type === 'electric'" type="success">纯电动</el-tag>
            <el-tag v-else-if="row.fuel_type === 'hybrid'" type="warning">混合动力</el-tag>
            <el-tag v-else type="info">柴油</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_maintenance" label="上次维保" width="120" />
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑车辆' : '新增车辆'"
      width="500px"
    >
      <el-form :model="formData" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="车辆编号" prop="bus_number">
          <el-input v-model="formData.bus_number" placeholder="例如: B1001" />
        </el-form-item>
        <el-form-item label="车牌号" prop="plate_number">
          <el-input v-model="formData.plate_number" placeholder="例如: 粤A12345" />
        </el-form-item>
        <el-form-item label="车型" prop="model">
          <el-input v-model="formData.model" placeholder="例如: 宇通ZK6120" />
        </el-form-item>
        <el-form-item label="核载人数" prop="capacity">
          <el-input-number v-model="formData.capacity" :min="1" :max="200" />
        </el-form-item>
        <el-form-item label="能源类型" prop="fuel_type">
          <el-select v-model="formData.fuel_type">
            <el-option label="纯电动" value="electric" />
            <el-option label="混合动力" value="hybrid" />
            <el-option label="柴油" value="diesel" />
          </el-select>
        </el-form-item>
        <el-form-item label="上次维保" prop="last_maintenance">
          <el-date-picker
            v-model="formData.last_maintenance"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status">
            <el-option label="运营中" value="operational" />
            <el-option label="保养中" value="maintenance" />
            <el-option label="维修中" value="repair" />
            <el-option label="已报废" value="retired" />
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { api } from '../../api';
import type { Bus } from '../../types';

const buses = ref<Bus[]>([]);
const loading = ref(true);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const formRef = ref();

const formData = reactive<Partial<Bus>>({
  bus_number: '',
  plate_number: '',
  model: '',
  capacity: 80,
  fuel_type: 'electric',
  status: 'operational',
  last_maintenance: ''
});

const rules = {
  bus_number: [{ required: true, message: '请输入车辆编号', trigger: 'blur' }],
  plate_number: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
  model: [{ required: true, message: '请输入车型', trigger: 'blur' }]
};

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    operational: 'success',
    maintenance: 'warning',
    repair: 'danger',
    retired: 'info'
  };
  return map[status] || 'info';
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    operational: '运营中',
    maintenance: '保养中',
    repair: '维修中',
    retired: '已报废'
  };
  return map[status] || status;
};

const fetchBuses = async () => {
  loading.value = true;
  try {
    buses.value = await api.buses.getAll();
  } finally {
    loading.value = false;
  }
};

const handleCreate = () => {
  isEdit.value = false;
  Object.assign(formData, {
    id: 0,
    bus_number: '',
    plate_number: '',
    model: '',
    capacity: 80,
    fuel_type: 'electric',
    status: 'operational',
    last_maintenance: ''
  });
  dialogVisible.value = true;
};

const handleEdit = (row: Bus) => {
  isEdit.value = true;
  Object.assign(formData, row);
  dialogVisible.value = true;
};

const handleDelete = (row: Bus) => {
  ElMessageBox.confirm(
    `确定要删除车辆 ${row.bus_number} 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await api.buses.delete(row.id);
      ElMessage.success('删除成功');
      fetchBuses();
    } catch (error) {
      ElMessage.error('删除失败');
    }
  });
};

const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true;
      try {
        if (isEdit.value) {
          await api.buses.update(formData.id, formData);
          ElMessage.success('更新成功');
        } else {
          // @ts-ignore
          await api.buses.create(formData);
          ElMessage.success('创建成功');
        }
        dialogVisible.value = false;
        fetchBuses();
      } catch (error) {
        ElMessage.error('操作失败');
      } finally {
        submitting.value = false;
      }
    }
  });
};

onMounted(() => {
  fetchBuses();
});
</script>
