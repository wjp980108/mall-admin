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
  productName: { required: true, message: '请输入商品名称', trigger: 'blur' },
  price: { required: true, message: '请输入价格', trigger: 'change' },
  bidAt: { required: true, message: '请输入拍下时间', trigger: 'blur' },
  remainingPaymentTime: { required: true, message: '请输入当前剩余付款时间', trigger: 'blur' },
  buyerId: { required: true, message: '请输入买家ID', trigger: 'blur' },
  buyerPhone: { required: true, message: '请输入买家手机号', trigger: 'blur' },
  buyerName: { required: true, message: '请输入买家姓名', trigger: 'blur' },
  sellerPhone: { required: true, message: '请输入卖家手机号', trigger: 'blur' },
  sellerName: { required: true, message: '请输入卖家姓名', trigger: 'blur' },
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
      <app-form-item label="订单ID">
        <el-input v-model="state.orderId" disabled />
      </app-form-item>
      <app-form-item label="商品名称" prop="productName">
        <el-input v-model="state.productName" placeholder="请输入商品名称" />
      </app-form-item>
      <app-form-item label="价格" prop="price">
        <el-input-number v-model="state.price" :min="0" :precision="2" class="w-full" />
      </app-form-item>
      <app-form-item label="拍下时间" prop="bidAt">
        <el-input v-model="state.bidAt" placeholder="请输入拍下时间" />
      </app-form-item>
      <app-form-item label="当前剩余付款时间" prop="remainingPaymentTime">
        <el-input v-model="state.remainingPaymentTime" placeholder="请输入当前剩余付款时间" />
      </app-form-item>
      <app-form-item label="买家ID" prop="buyerId">
        <el-input v-model="state.buyerId" placeholder="请输入买家ID" />
      </app-form-item>
      <app-form-item label="买家手机号" prop="buyerPhone">
        <el-input v-model="state.buyerPhone" placeholder="请输入买家手机号" />
      </app-form-item>
      <app-form-item label="买家姓名" prop="buyerName">
        <el-input v-model="state.buyerName" placeholder="请输入买家姓名" />
      </app-form-item>
      <app-form-item label="买家上级昵称">
        <el-input v-model="state.buyerParentNickname" placeholder="请输入买家上级昵称" />
      </app-form-item>
      <app-form-item label="买家顶级昵称">
        <el-input v-model="state.buyerTopNickname" placeholder="请输入买家顶级昵称" />
      </app-form-item>
      <app-form-item label="卖家手机号" prop="sellerPhone">
        <el-input v-model="state.sellerPhone" placeholder="请输入卖家手机号" />
      </app-form-item>
      <app-form-item label="卖家姓名" prop="sellerName">
        <el-input v-model="state.sellerName" placeholder="请输入卖家姓名" />
      </app-form-item>
    </app-form>
  </app-drawer>
</template>
