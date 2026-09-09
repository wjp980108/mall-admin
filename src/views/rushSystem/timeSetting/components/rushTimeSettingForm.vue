<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { omit } from 'lodash-es';
import { uploadImage } from '@/api';
import { createRushTimeSetting, updateRushTimeSetting } from '@/api/rushSystem/timeSetting';
import { fileStoragePlatform } from '@/constants/common.ts';
import { useState } from './useState.ts';

defineOptions({ name: 'RushTimeSettingForm' });

const emit = defineEmits(['confirm']);

const { showForm, state, reset } = useState();

const title = computed(() => {
  return state.value.id ? '编辑抢购时间' : '新增抢购时间';
});

watch(showForm, (value) => {
  if (!value)
    reset();
});

const formRef = useTemplateRef<FormInstance>('formRef');
const rules = computed<FormRules>(() => ({
  sessionName: { required: true, message: '请输入场次名称', trigger: 'blur' },
  rushStartTime: { required: true, message: '请选择抢购开始时间', trigger: 'change' },
  rushEndTime: { required: true, message: '请选择抢购结束时间', trigger: 'change' },
  bgImg: { required: true, message: '请上传场次背景图', trigger: 'change' },
  sort: { required: true, message: '请输入显示顺序', trigger: 'blur' },
}));

// 存储平台
const uploadPlatformOptions = Object.entries(fileStoragePlatform);

// 上传场次背景图
function uploadBgImg(data: FormData) {
  data.append('bgImgPlatform', state.value.bgImgPlatform);
  return uploadImage(data);
}

async function handleConfirm() {
  try {
    await formRef.value?.validate();

    if (state.value.id)
      await updateRushTimeSetting(state.value);
    else
      await createRushTimeSetting(omit(state.value, 'id'));

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
      <app-form-item label="场次名称" prop="sessionName" :span="2">
        <el-input v-model="state.sessionName" placeholder="请输入场次名称" />
      </app-form-item>
      <app-form-item label="抢购时间设置" :span="2" required>
        <app-flex class="w-full" vertical>
          <app-form-item prop="rushStartTime">
            <el-time-select
              v-model="state.rushStartTime" :max-time="state.rushEndTime"
              placeholder="开始时间" start="07:00" step="00:30" end="23:59"
            />
          </app-form-item>
          <app-form-item prop="rushEndTime">
            <el-time-select
              v-model="state.rushEndTime" :min-time="state.rushStartTime"
              placeholder="结束时间" start="07:00" step="00:30" end="23:59"
            />
          </app-form-item>
        </app-flex>
      </app-form-item>
      <app-form-item label="场次背景图" prop="bgImg">
        <app-upload v-model="state.bgImg" type="image" :api="uploadBgImg" />
      </app-form-item>
      <app-form-item label="存储平台" prop="bgImgPlatform" help-info="场次背景图需要存储到那个平台下">
        <el-select
          v-model="state.bgImgPlatform" placeholder="请选择存储平台" :disabled="!!state.bgImg"
          :clearable="false"
        >
          <el-option
            v-for="[value, label] in uploadPlatformOptions" :key="value" :label="label"
            :value="value"
          />
        </el-select>
      </app-form-item>
      <app-form-item label="显示顺序" prop="sort">
        <el-input-number v-model="state.sort" :min="1" placeholder="请输入显示顺序" />
      </app-form-item>
      <app-form-item label="场次状态" prop="sessionStatus">
        <el-radio-group v-model="state.sessionStatus">
          <el-radio label="开启" :value="true" />
          <el-radio label="关闭" :value="false" />
        </el-radio-group>
      </app-form-item>
    </app-form>
  </app-drawer>
</template>
