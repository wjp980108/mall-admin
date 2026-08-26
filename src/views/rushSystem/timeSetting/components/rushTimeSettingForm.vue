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
  entryControlMinutes: { required: true, message: '请输入进场时间控制', trigger: 'change' },
  startTime: { required: true, message: '请选择抢购开始时间', trigger: 'change' },
  endTime: { required: true, message: '请选择抢购结束时间', trigger: 'change' },
  maxPurchaseCount: { required: true, message: '请输入最多购买次数', trigger: 'change' },
  beforeStartConsignmentMinutes: {
    required: true,
    message: '请输入开场前禁止委托时间',
    trigger: 'change',
  },
  afterEndConsignmentMinutes: {
    required: true,
    message: '请输入结束后禁止委托时间',
    trigger: 'change',
  },
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
      <app-form-item label="抢购时间设置" :span="2">
        <app-flex class="w-full" vertical>
          <el-time-select
            v-model="state.rushStartTime" :max-time="state.rushEndTime"
            placeholder="开始时间" start="08:30" step="00:15" end="18:30"
          />
          <el-time-select
            v-model="state.rushEndTime" :min-time="state.rushStartTime"
            placeholder="结束时间" start="08:30" step="00:15" end="18:30"
          />
        </app-flex>
      </app-form-item>
      <app-form-item label="进场时间控制" prop="enterControlMinute" help-info="单位：分钟">
        <el-input-number v-model="state.enterControlMinute" :min="0" :precision="0" />
      </app-form-item>
      <app-form-item label="最多购买次数" prop="maxBuyCount">
        <el-input-number v-model="state.maxBuyCount" :min="1" :precision="0" />
      </app-form-item>
      <app-form-item label="开场前禁止委托时间" prop="beforeForbidMinute" help-info="单位：分钟">
        <el-input-number v-model="state.beforeForbidMinute" :min="0" :precision="0" />
      </app-form-item>
      <app-form-item label="结束后禁止委托时间" prop="afterForbidMinute" help-info="单位：分钟">
        <el-input-number v-model="state.afterForbidMinute" :min="0" :precision="0" />
      </app-form-item>
      <app-form-item label="场次背景图" prop="bgImg">
        <app-upload v-model="state.bgImg" type="image" :api="uploadBgImg" />
      </app-form-item>
      <app-form-item label="存储平台" prop="coverImgPlatform" help-info="场次背景图需要存储到那个平台下">
        <el-select
          v-model="state.bgImgPlatform" placeholder="请选择存储平台" :disabled="!!state.bgImg"
          :clearable="false"
        >
          <el-option
            v-for="[value, label] in uploadPlatformOptions" :key="value" :label="label" :value="value"
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
