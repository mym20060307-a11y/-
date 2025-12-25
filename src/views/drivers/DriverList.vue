<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">司机管理</h2>
      <el-button type="primary" icon="Plus" @click="handleCreate">新增司机</el-button>
    </div>

    <el-card shadow="never">
      <el-table :data="drivers" style="width: 100%" v-loading="loading">
        <el-table-column prop="driver_name" label="姓名" width="120" />
        <el-table-column prop="license_number" label="驾驶证号" width="180" />
        <el-table-column prop="phone" label="联系电话" width="150" />
        <el-table-column prop="birth_date" label="出生日期" width="150" />
        <el-table-column prop="license_expiry" label="证件有效期" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'active'" type="success">在职</el-tag>
            <el-tag v-else-if="row.status === 'suspended'" type="warning">暂停</el-tag>
            <el-tag v-else type="info">离职</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small">培训记录</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑司机' : '新增司机'"
      width="500px"
    >
      <el-form :model="formData" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="姓名" prop="driver_name">
          <el-input v-model="formData.driver_name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="驾驶证号" prop="license_number">
          <el-input v-model="formData.license_number" placeholder="请输入驾驶证号" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birth_date">
          <el-date-picker
            v-model="formData.birth_date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="证件有效期" prop="license_expiry">
          <el-date-picker
            v-model="formData.license_expiry"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status">
            <el-option label="在职" value="active" />
            <el-option label="暂停" value="suspended" />
            <el-option label="离职" value="inactive" />
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
import type { Driver } from '../../types';

const drivers = ref<Driver[]>([]);
const loading = ref(true);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const formRef = ref();

const formData = reactive<Partial<Driver>>({
  driver_name: '',
  license_number: '',
  phone: '',
  birth_date: '',
  license_expiry: '',
  status: 'active'
});

const rules = {
  driver_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  license_number: [{ required: true, message: '请输入驾驶证号', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
};

const fetchDrivers = async () => {
  loading.value = true;
  try {
    drivers.value = await api.drivers.getAll();
  } finally {
    loading.value = false;
  }
};

const handleCreate = () => {
  isEdit.value = false;
  Object.assign(formData, {
    id: 0,
    driver_name: '',
    license_number: '',
    phone: '',
    birth_date: '',
    license_expiry: '',
    status: 'active'
  });
  dialogVisible.value = true;
};

const handleEdit = (row: Driver) => {
  isEdit.value = true;
  Object.assign(formData, row);
  dialogVisible.value = true;
};

const handleDelete = (row: Driver) => {
  ElMessageBox.confirm(
    `确定要删除司机 ${row.driver_name} 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await api.drivers.delete(row.id);
      ElMessage.success('删除成功');
      fetchDrivers();
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
          await api.drivers.update(formData.id, formData);
          ElMessage.success('更新成功');
        } else {
          // @ts-ignore
          await api.drivers.create(formData);
          ElMessage.success('创建成功');
        }
        dialogVisible.value = false;
        fetchDrivers();
      } catch (error) {
        ElMessage.error('操作失败');
      } finally {
        submitting.value = false;
      }
    }
  });
};

onMounted(() => {
  fetchDrivers();
});
</script>
