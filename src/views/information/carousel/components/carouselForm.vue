<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { uploadImage } from '@/api';
import { createCarousel, updateCarousel } from '@/api/information/carousel';
import { fileStoragePlatform } from '@/constants/common.ts';
import { useState } from './useState.ts';

defineOptions({ name: 'CarouselForm' });

const emit = defineEmits<{ confirm: [] }>();

const { showForm, state, reset } = useState();

const title = computed(() => {
  return state.value.id ? '编辑轮播图' : '新增轮播图';
});

const rules = computed<FormRules>(() => ({
  imgUrl: { required: true, message: '请上传轮播图', trigger: 'change' },
  position: { required: true, message: '请输入轮播图位置', trigger: 'change' },
}));

const formRef = useTemplateRef<FormInstance>('formRef');

watch(showForm, (value) => {
  if (!value)
    reset();
});

// 存储平台
const uploadPlatformOptions = Object.entries(fileStoragePlatform);

// 上传头像
function uploadCarousel(data: FormData) {
  data.append('platform', state.value.platform);
  return uploadImage(data);
}

async function handleConfirm() {
  try {
    await formRef.value?.validate();

    if (state.value.id) {
      await updateCarousel(state.value);
    }
    else {
      const { id: _id, ...data } = state.value;
      await createCarousel(data);
    }

    showForm.value = false;
    emit('confirm');
  }
  catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <app-drawer v-model="showForm" :title size="600" resizable @confirm="handleConfirm">
    <app-form ref="formRef" :model="state" :rules>
      <app-form-item label="轮播图" prop="imgUrl">
        <app-upload v-model="state.imgUrl" type="image" :api="uploadCarousel" />
      </app-form-item>
      <app-form-item label="存储平台" help-info="轮播图需要存储到那个平台下">
        <el-select v-model="state.platform" placeholder="请选择存储平台" :disabled="!!state.imgUrl" :clearable="false">
          <el-option
            v-for="[value, label] in uploadPlatformOptions" :key="value" :label="label" :value="value"
          />
        </el-select>
      </app-form-item>
      <app-form-item label="轮播图位置" prop="position">
        <el-input v-model="state.position" placeholder="请输入轮播图位置" />
      </app-form-item>
      <app-form-item label="权重" prop="sort" help-info="越大越考前">
        <el-input-number v-model="state.sort" />
      </app-form-item>
    </app-form>
  </app-drawer>
</template>
