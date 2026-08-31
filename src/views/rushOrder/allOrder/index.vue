<script setup lang="tsx">
import { deleteRushOrder, fetchRushOrderList } from '@/api/rushOrder/allOrder';
import { renderIcon, useTable } from '@/components';
import { useConfirm } from '@/hooks/useConfirm';
import RushOrderForm from './components/rushOrderForm.vue';
import { useState } from './components/useState.ts';

defineOptions({ name: 'RushOrderAllOrder' });

const { showForm, setState } = useState();

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchRushOrderList,
  apiParams: {
    orderNo: '',
    productName: '',
    buyerName: '',
  },
  isPagination: true,
  columns: () => [
    { prop: 'id', label: 'ID', width: 80 },
    { prop: 'orderNo', label: '订单编号', minWidth: 180, showOverflowTooltip: true },
    { prop: 'productName', label: '商品名称', minWidth: 160, showOverflowTooltip: true },
    { prop: 'buyerName', label: '购买人', minWidth: 120, showOverflowTooltip: true },
    { prop: 'productPrice', label: '商品单价', type: 'money', width: 120, align: 'right' },
    { prop: 'quantity', label: '购买数量', width: 100, align: 'right' },
    { prop: 'totalAmount', label: '订单金额', type: 'money', width: 120, align: 'right' },
    { prop: 'status', label: '订单状态', width: 120, align: 'center' },
    { prop: 'receiverName', label: '收货人', width: 120, showOverflowTooltip: true },
    { prop: 'receiverPhone', label: '收货手机号', width: 140 },
    { prop: 'receiverAddress', label: '收货地址', minWidth: 180, showOverflowTooltip: true },
    { prop: 'createdAt', label: '下单时间', type: 'dateTime', width: 180 },
    {
      label: '操作',
      type: 'operation',
      fixed: 'right',
      width: 150,
      align: 'center',
      buttons: [
        {
          label: '编辑',
          icon: 'EditPen',
          onClick: ({ row }) => setState(row),
        },
        {
          label: '删除',
          type: 'danger',
          icon: 'Delete',
          onClick: async ({ row }) => {
            await useConfirm(deleteRushOrder, row.id, '删除该订单');
            await getTableData();
          },
        },
      ],
    },
  ],
});
</script>

<template>
  <div class="main-container">
    <app-card>
      <app-form show-action inline :loading="tableProps.loading" @search="getTableData" @reset="resetParams">
        <app-form-item label="订单编号">
          <el-input v-model="params.orderNo" placeholder="请输入订单编号" clearable />
        </app-form-item>
        <app-form-item label="商品名称">
          <el-input v-model="params.productName" placeholder="请输入商品名称" clearable />
        </app-form-item>
        <app-form-item label="购买人">
          <el-input v-model="params.buyerName" placeholder="请输入购买人" clearable />
        </app-form-item>
      </app-form>
    </app-card>
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="getTableData">
      <template #button>
        <el-button type="primary" :icon="renderIcon('CirclePlus')" plain @click="showForm = true">
          新增订单
        </el-button>
      </template>
    </app-table>
    <RushOrderForm @confirm="getTableData" />
  </div>
</template>
