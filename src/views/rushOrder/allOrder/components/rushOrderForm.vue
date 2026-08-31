<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { createRushOrder, updateRushOrder } from '@/api/rushOrder/allOrder';
import { useState } from './useState.ts';

defineOptions({ name: 'RushOrderForm' });

const emit = defineEmits(['confirm']);

const { showForm, state, reset } = useState();

const title = computed(() => state.value.id ? '编辑订单' : '新增订单');

watch(showForm, (value) => {
  if (!value)
    reset();
});

const formRef = useTemplateRef<FormInstance>('formRef');
const rules = computed<FormRules>(() => ({
  orderNo: { required: true, message: '请输入订单编号', trigger: 'blur' },
  productName: { required: true, message: '请输入商品名称', trigger: 'blur' },
  buyerName: { required: true, message: '请输入购买人', trigger: 'blur' },
  productPrice: { required: true, message: '请输入商品单价', trigger: 'change' },
  quantity: { required: true, message: '请输入购买数量', trigger: 'change' },
  totalAmount: { required: true, message: '请输入订单金额', trigger: 'change' },
  status: { required: true, message: '请输入订单状态', trigger: 'blur' },
}));

async function handleConfirm() {
  try {
    await formRef.value?.validate();

    if (state.value.id) {
      await updateRushOrder(state.value);
    }
    else {
      const { id: _id, ...data } = state.value;
      await createRushOrder(data);
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
      <app-form-item label="订单编号" prop="orderNo">
        <el-input v-model="state.orderNo" placeholder="请输入订单编号" :disabled="!!state.id" />
      </app-form-item>
      <app-form-item label="订单状态" prop="status">
        <el-input v-model="state.status" placeholder="请输入订单状态" />
      </app-form-item>
      <app-form-item label="商品名称" prop="productName">
        <el-input v-model="state.productName" placeholder="请输入商品名称" />
      </app-form-item>
      <app-form-item label="购买人" prop="buyerName">
        <el-input v-model="state.buyerName" placeholder="请输入购买人" />
      </app-form-item>
      <app-form-item label="商品单价（元）" prop="productPrice">
        <el-input-number v-model="state.productPrice" :min="0" :precision="2" class="w-full" />
      </app-form-item>
      <app-form-item label="购买数量" prop="quantity">
        <el-input-number v-model="state.quantity" :min="1" :precision="0" class="w-full" />
      </app-form-item>
      <app-form-item label="订单金额（元）" prop="totalAmount">
        <el-input-number v-model="state.totalAmount" :min="0" :precision="2" class="w-full" />
      </app-form-item>
      <app-form-item label="收货人">
        <el-input v-model="state.receiverName" placeholder="请输入收货人" />
      </app-form-item>
      <app-form-item label="收货手机号">
        <el-input v-model="state.receiverPhone" placeholder="请输入收货手机号" />
      </app-form-item>
      <app-form-item label="收货地址" :span="2">
        <el-input v-model="state.receiverAddress" placeholder="请输入收货地址" />
      </app-form-item>
      <app-form-item label="备注" :span="2">
        <el-input v-model="state.remark" type="textarea" :rows="3" placeholder="请输入备注" />
      </app-form-item>
    </app-form>
  </app-drawer>
</template>
