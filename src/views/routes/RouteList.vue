<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <el-icon class="mr-2 text-blue-500" size="24">
          <Location />
        </el-icon>
        <h2 class="text-2xl font-bold text-gray-800">城市公交系统</h2>
      </div>
      <el-button type="primary" @click="handleCreate">
        <el-icon class="mr-1">
          <CirclePlus />
        </el-icon>
        新增线路
      </el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="routes" style="width: 100%" v-loading="loading">
        <el-table-column prop="route_number" label="线路编号" width="120" />
        <el-table-column prop="route_name" label="线路名称" width="180" />
        <el-table-column prop="start_station" label="始发站" width="150" />
        <el-table-column prop="end_station" label="终点站" width="150" />
        <el-table-column prop="operating_hours" label="运营时间" width="180" />
        <el-table-column prop="interval_minutes" label="发车间隔(分)" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '运营中' : '停运' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small">站点管理</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑线路' : '新增线路'"
      width="500px"
    >
      <el-form :model="formData" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="线路编号" prop="route_number">
          <el-input v-model="formData.route_number" placeholder="例如: 101" />
        </el-form-item>
        <el-form-item label="线路名称" prop="route_name">
          <el-input v-model="formData.route_name" placeholder="例如: 市中心环线" />
        </el-form-item>
        <el-form-item label="始发站" prop="start_station">
          <el-input v-model="formData.start_station" />
        </el-form-item>
        <el-form-item label="终点站" prop="end_station">
          <el-input v-model="formData.end_station" />
        </el-form-item>
        <el-form-item label="运营时间" prop="operating_hours">
          <el-input v-model="formData.operating_hours" placeholder="例如: 06:00-22:00" />
        </el-form-item>
        <el-form-item label="发车间隔" prop="interval_minutes">
          <el-input-number v-model="formData.interval_minutes" :min="1" :max="120" />
          <span class="ml-2">分钟</span>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status">
            <el-option label="运营中" value="active" />
            <el-option label="停运" value="inactive" />
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
import { Location, CirclePlus } from '@element-plus/icons-vue';
import { api } from '../../api';
import type { Route } from '../../types';

const routes = ref<Route[]>([]);
const loading = ref(true);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const formRef = ref();

const formData = reactive<Partial<Route>>({
  route_number: '',
  route_name: '',
  start_station: '',
  end_station: '',
  operating_hours: '',
  interval_minutes: 15,
  status: 'active'
});

const rules = {
  route_number: [{ required: true, message: '请输入线路编号', trigger: 'blur' }],
  route_name: [{ required: true, message: '请输入线路名称', trigger: 'blur' }],
  start_station: [{ required: true, message: '请输入始发站', trigger: 'blur' }],
  end_station: [{ required: true, message: '请输入终点站', trigger: 'blur' }]
};

const fetchRoutes = async () => {
  loading.value = true;
  try {
    routes.value = await api.routes.getAll();
  } finally {
    loading.value = false;
  }
};

const handleCreate = () => {
  isEdit.value = false;
  Object.assign(formData, {
    id: 0,
    route_number: '',
    route_name: '',
    start_station: '',
    end_station: '',
    operating_hours: '06:00-22:00',
    interval_minutes: 15,
    status: 'active'
  });
  dialogVisible.value = true;
};

const handleEdit = (row: Route) => {
  isEdit.value = true;
  Object.assign(formData, row);
  dialogVisible.value = true;
};

const handleDelete = (row: Route) => {
  ElMessageBox.confirm(
    `确定要删除线路 ${row.route_number} 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await api.routes.delete(row.id);
      ElMessage.success('删除成功');
      fetchRoutes();
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
          await api.routes.update(formData.id, formData);
          ElMessage.success('更新成功');
        } else {
          // @ts-ignore
          await api.routes.create(formData);
          ElMessage.success('创建成功');
        }
        dialogVisible.value = false;
        fetchRoutes();
      } catch (error) {
        ElMessage.error('操作失败');
      } finally {
        submitting.value = false;
      }
    }
  });
};

onMounted(() => {
  fetchRoutes();
});
</script>
