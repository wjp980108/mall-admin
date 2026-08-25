<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { omit } from 'lodash-es';
import { uploadImage } from '@/api';
import { createUser, fetchRoleList, updateUser } from '@/api/system/user.ts';
import { fileStoragePlatform } from '@/constants/common';
import { useState } from '@/views/system/user/components/useState.ts';

defineOptions({ name: 'UserForm' });

const emit = defineEmits(['confirm']);

const { showForm, state, reset } = useState();

const title = computed(() => {
  return state.value.id ? '编辑用户' : '新增用户';
});

// 获取角色列表 --- start
const roleList = ref<Role.Item[]>([]);
async function getRoleList() {
  const res = await fetchRoleList();
  roleList.value = res.data;
}
// 获取角色列表 --- end

watch(showForm, (value) => {
  if (value)
    getRoleList();
  else
    reset();
});

// 存储平台
const uploadPlatformOptions = Object.entries(fileStoragePlatform);

// 上传头像
function uploadAvatar(data: FormData) {
  data.append('platform', state.value.platform);
  return uploadImage(data);
}

const formRef = useTemplateRef<FormInstance>('formRef');
const rules = computed<FormRules>(() => ({
  username: { required: true, message: '请输入用户名', trigger: 'blur' },
  nickname: { required: true, message: '请输入昵称', trigger: 'blur' },
  roleIds: { required: true, message: '请选择角色', trigger: 'change' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
  phone: { required: true, message: '请输入手机号', trigger: 'blur' },
}));

async function handleConfirm() {
  try {
    await formRef.value?.validate();

    if (state.value.id)
      await updateUser(omit(state.value, 'password'));
    else
      await createUser(omit(state.value, 'id'));

    showForm.value = false;
    emit('confirm');
  }
  catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <app-drawer v-model="showForm" :title size="700" resizable @confirm="handleConfirm">
    <app-form ref="formRef" :model="state" :rules :cols="2">
      <app-form-item label="用户名" prop="username">
        <el-input v-model="state.username" placeholder="请输入用户名" :disabled="!!state.id" />
      </app-form-item>
      <app-form-item label="昵称" prop="nickname">
        <el-input v-model="state.nickname" placeholder="请输入昵称" />
      </app-form-item>
      <app-form-item label="头像">
        <app-upload v-model="state.avatar" type="image" :api="uploadAvatar" />
      </app-form-item>
      <app-form-item label="存储平台" help-info="头像需要存储到那个平台下">
        <el-select v-model="state.platform" placeholder="请选择存储平台" :disabled="!!state.avatar" :clearable="false">
          <el-option
            v-for="[value, label] in uploadPlatformOptions" :key="value" :label="label" :value="value"
          />
        </el-select>
      </app-form-item>
      <app-form-item v-if="!state.id" label="密码" prop="password">
        <el-input v-model="state.password" type="password" placeholder="请输入密码" show-password />
      </app-form-item>
      <app-form-item label="角色" prop="roleIds">
        <el-select v-model="state.roleIds" placeholder="请选择角色" filterable multiple>
          <el-option v-for="role in roleList" :key="role.id" :label="role.roleName" :value="role.id" />
        </el-select>
      </app-form-item>
      <app-form-item label="手机号" prop="phone">
        <el-input v-model="state.phone" placeholder="请输入手机号" />
      </app-form-item>
      <app-form-item label="邮箱" prop="email">
        <el-input v-model="state.email" placeholder="请输入邮箱" />
      </app-form-item>
      <app-form-item label="性别" prop="gender">
        <el-radio-group v-model="state.gender">
          <el-radio label="未知" :value="0" />
          <el-radio label="男" :value="1" />
          <el-radio label="女" :value="2" />
        </el-radio-group>
      </app-form-item>
      <app-form-item label="用户状态" prop="status">
        <el-radio-group v-model="state.status">
          <el-radio label="启用" :value="true" />
          <el-radio label="禁用" :value="false" />
        </el-radio-group>
      </app-form-item>
      <app-form-item label="备注" prop="remark" :span="2">
        <el-input v-model="state.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </app-form-item>
    </app-form>
  </app-drawer>
</template>
