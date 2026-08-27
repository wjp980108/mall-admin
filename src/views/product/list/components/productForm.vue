<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { omit } from 'lodash-es';
import { uploadImage } from '@/api/index.ts';
import { createProduct, updateProduct } from '@/api/product/list';
import { fileStoragePlatform } from '@/constants/common.ts';
import { useState } from './useState.ts';

defineOptions({ name: 'ProductForm' });

const emit = defineEmits(['confirm']);

const { showForm, state, reset } = useState();

const title = computed(() => {
  return state.value.id ? '编辑商品' : '新增商品';
});

watch(showForm, (value) => {
  if (!value)
    reset();
});

const formRef = useTemplateRef<FormInstance>('formRef');
const rules = computed<FormRules>(() => ({
  goodsName: { required: true, message: '请输入商品名称', trigger: 'blur' },
  price: { required: true, message: '请输入商品价格', trigger: 'blur' },
  stock: { required: true, message: '请输入库存', trigger: 'blur' },
  sales: { required: true, message: '请输入销量', trigger: 'blur' },
  goodsThumb: { required: true, message: '请上传商品图片', trigger: 'change' },
}));

// 存储平台
const uploadPlatformOptions = Object.entries(fileStoragePlatform);

// 上传商品图
function uploadGoodsImg(data: FormData) {
  data.append('goodsThumbPlatform', state.value.goodsThumbPlatform);
  return uploadImage(data);
}

async function handleConfirm() {
  try {
    await formRef.value?.validate();

    if (state.value.id)
      await updateProduct(state.value);
    else
      await createProduct(omit(state.value, 'id'));

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
      <app-form-item label="商品价格" prop="price">
        <el-input-number v-model="state.price" :min="0" :precision="2" />
      </app-form-item>
      <app-form-item label="库存" prop="stock">
        <el-input-number v-model="state.stock" :min="0" :precision="0" />
      </app-form-item>
      <app-form-item label="销量" prop="sales">
        <el-input-number v-model="state.sales" :min="0" :precision="0" />
      </app-form-item>
      <app-form-item label="商品图片" prop="goodsThumb">
        <app-upload v-model="state.goodsThumb" type="image" :api="uploadGoodsImg" />
      </app-form-item>
      <app-form-item
        label="存储平台" prop="goodsThumbPlatform"
        help-info="商品图片需要存储到那个平台下"
      >
        <el-select
          v-model="state.goodsThumbPlatform" placeholder="请选择存储平台"
          :disabled="!!state.goodsThumb"
          :clearable="false"
        >
          <el-option
            v-for="[value, label] in uploadPlatformOptions" :key="value" :label="label"
            :value="value"
          />
        </el-select>
      </app-form-item>
      <app-form-item label="商品状态" prop="status">
        <el-radio-group v-model="state.status">
          <el-radio label="上架" :value="true" />
          <el-radio label="下架" :value="false" />
        </el-radio-group>
      </app-form-item>
    </app-form>
  </app-drawer>
</template>
