<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { omit } from 'lodash-es';
import { createAnnouncement, updateAnnouncement } from '@/api/information/announcement';
import { useState } from './useState.ts';

defineOptions({ name: 'AnnouncementForm' });

const emit = defineEmits(['confirm']);

const { showForm, state, reset } = useState();

const title = computed(() => {
  return state.value.id ? '编辑公告' : '新增公告';
});

const rules = computed<FormRules>(() => ({
  title: { required: true, message: '请输入公告标题', trigger: 'blur' },
  content: { required: true, message: '请输入公告内容', trigger: 'blur' },
}));

const formRef = useTemplateRef<FormInstance>('formRef');

watch(showForm, (value) => {
  if (!value)
    reset();
});

async function handleConfirm() {
  try {
    await formRef.value?.validate();

    if (state.value.id)
      await updateAnnouncement(state.value);
    else
      await createAnnouncement(omit(state.value, 'id'));

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
    <app-form ref="formRef" :model="state" :rules>
      <app-form-item label="标题" prop="title">
        <el-input v-model="state.title" placeholder="请输入公告标题" />
      </app-form-item>
      <app-form-item label="公告内容" prop="content">
        <app-editor v-model="state.content" />
      </app-form-item>
    </app-form>
  </app-drawer>
</template>
