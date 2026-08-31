<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { updatePendingPaymentOrder } from '@/api/rushOrder/pendingPaymentOrder';
import { useState } from './useState.ts';

defineOptions({ name: 'PendingPaymentOrderForm' });

const emit = defineEmits(['confirm']);

const { showForm, state, reset } = useState();

watch(showForm, (value) => {
  if (!value)
    reset();
});

const formRef = useTemplateRef<FormInstance>('formRef');
const rules = computed<FormRules>(() => ({
  goodsName: { required: true, message: '请输入商品名称', trigger: 'blur' },
  rushPrice: { required: true, message: '请输入价格', trigger: 'change' },
  buyerPhone: { required: true, message: '请输入买家手机号', trigger: 'blur' },
  buyerName: { required: true, message: '请输入买家姓名', trigger: 'blur' },
}));

async function handleConfirm() {
  try {
    await formRef.value?.validate();
    await updatePendingPaymentOrder(state.value);
    showForm.value = false;
    emit('confirm');
  }
  catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <app-drawer v-model="showForm" title="编辑待付款订单" size="700" resizable @confirm="handleConfirm">
    <app-form ref="formRef" :model="state" :rules :cols="2">
      <app-form-item label="商品名称" prop="goodsName">
        <el-input v-model="state.goodsName" placeholder="请输入商品名称" />
      </app-form-item>
      <app-form-item label="价格" prop="rushPrice">
        <el-input-number v-model="state.rushPrice" :min="0" :precision="2" />
      </app-form-item>
      <app-form-item label="买家手机号" prop="buyerPhone">
        <el-input v-model="state.buyerPhone" placeholder="请输入买家手机号" />
      </app-form-item>
      <app-form-item label="买家姓名" prop="buyerName">
        <el-input v-model="state.buyerName" placeholder="请输入买家姓名" />
      </app-form-item>
    </app-form>
  </app-drawer>
</template>
