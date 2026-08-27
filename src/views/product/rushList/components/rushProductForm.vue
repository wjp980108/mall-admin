<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import type { RushTimeSettingItem } from '@/api/rushSystem/timeSetting.ts';
import { uploadImage } from '@/api/index.ts';
import {
  createRushProduct,
  fetchSessionList,
  fetchUserList,
  updateRushProduct,
} from '@/api/product/rushList.ts';
import { fileStoragePlatform } from '@/constants/common.ts';
import { useState } from './useState.ts';

defineOptions({ name: 'RushProductForm' });

const emit = defineEmits(['confirm']);

const { showForm, state, reset } = useState();

const title = computed(() => {
  return state.value.id ? '编辑抢购商品' : '新增抢购商品';
});

// 获取委托人列表 --- start
const userList = ref<User.Item[]>([]);

async function getUserList() {
  const res = await fetchUserList();
  userList.value = res.data;
}

// 获取委托人列表 --- end

// 获取所属场次列表 --- start
const sessionList = ref<RushTimeSettingItem[]>([]);

async function getSessionList() {
  const res = await fetchSessionList();
  sessionList.value = res.data;
}

// 获取所属场次列表 --- end

watch(showForm, (value) => {
  if (value) {
    getUserList();
    getSessionList();
  }
  else {
    reset();
  }
});

// 存储平台
const uploadPlatformOptions = Object.entries(fileStoragePlatform);

// 上传商品缩略图
function uploadCarousel(data: FormData) {
  data.append('coverImgPlatform', state.value.coverImgPlatform);
  return uploadImage(data);
}

const formRef = useTemplateRef<FormInstance>('formRef');
const rules = computed<FormRules>(() => ({
  goodsName: { required: true, message: '请输入商品名称', trigger: 'blur' },
  goodsPrice: { required: true, message: '请输入商品价格', trigger: 'blur' },
  memberId: { required: true, message: '请选择委托人', trigger: 'change' },
  sessionId: { required: true, message: '请选择所属场次', trigger: 'change' },
  coverImg: { required: true, message: '请上传商品缩略图', trigger: 'change' },
  detailImg: { required: true, message: '请上传商品详情图', trigger: 'change' },
  currentStatus: { required: true, message: '请输入商品当前状态', trigger: 'blur' },
}));

async function handleConfirm() {
  try {
    await formRef.value?.validate();

    if (state.value.id) {
      await updateRushProduct(state.value);
    }
    else {
      const { id: _id, ...data } = state.value;
      await createRushProduct(data);
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
  <app-drawer v-model="showForm" :title size="700" resizable @confirm="handleConfirm">
    <app-form ref="formRef" :model="state" :rules :cols="2">
      <app-form-item label="商品名称" prop="goodsName">
        <el-input v-model="state.goodsName" placeholder="请输入商品名称" />
      </app-form-item>
      <app-form-item label="商品价格" prop="goodsPrice">
        <el-input-number v-model="state.goodsPrice" :min="0" :precision="2" />
      </app-form-item>
      <app-form-item label="委托人" prop="memberId">
        <el-select
          v-model="state.memberId" :options="userList" placeholder="请选择委托人"
          filterable
        />
      </app-form-item>
      <app-form-item label="所属场次" prop="sessionId">
        <el-select
          v-model="state.sessionId" :options="sessionList" placeholder="请选择所属场次"
          filterable
        />
      </app-form-item>
      <app-form-item label="商品缩略图" prop="coverImg">
        <app-upload v-model="state.coverImg" type="image" :api="uploadCarousel" />
      </app-form-item>
      <app-form-item
        label="存储平台" prop="coverImgPlatform"
        help-info="商品缩略图需要存储到那个平台下"
      >
        <el-select
          v-model="state.coverImgPlatform" placeholder="请选择存储平台" :disabled="!!state.coverImg"
          :clearable="false"
        >
          <el-option
            v-for="[value, label] in uploadPlatformOptions" :key="value" :label="label"
            :value="value"
          />
        </el-select>
      </app-form-item>
      <app-form-item label="商品详情图" prop="detailImg">
        <app-upload v-model="state.detailImg" type="image" :api="uploadCarousel" />
      </app-form-item>
      <app-form-item
        label="存储平台" prop="detailImgPlatform"
        help-info="商品详情图需要存储到那个平台下"
      >
        <el-select
          v-model="state.detailImgPlatform" placeholder="请选择存储平台"
          :disabled="!!state.detailImg"
          :clearable="false"
        >
          <el-option
            v-for="[value, label] in uploadPlatformOptions" :key="value" :label="label"
            :value="value"
          />
        </el-select>
      </app-form-item>
      <app-form-item label="商品详情" prop="goodsDetail" :span="2">
        <app-editor v-model="state.goodsDetail" />
      </app-form-item>
      <app-form-item label="上架状态" prop="onlineStatus">
        <el-radio-group v-model="state.onlineStatus">
          <el-radio label="上架" :value="true" />
          <el-radio label="下架" :value="false" />
        </el-radio-group>
      </app-form-item>
    </app-form>
  </app-drawer>
</template>
