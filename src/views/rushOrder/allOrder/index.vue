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
    { prop: 'id', label: 'Id', width: 80 },
    { prop: 'productId', label: '商品ID', width: 100 },
    { prop: 'productName', label: '商品名称', minWidth: 160, showOverflowTooltip: true },
    { prop: 'sellerId', label: '卖方ID', width: 100 },
    { prop: 'sellerReceiptPhone', label: '卖家收款手机号', width: 150 },
    { prop: 'sellerName', label: '卖家姓名', width: 120, showOverflowTooltip: true },
    { prop: 'buyerId', label: '买方ID', width: 100 },
    { prop: 'buyerReceiptPhone', label: '买家收款手机号', width: 150 },
    { prop: 'buyerName', label: '买家姓名', width: 120, showOverflowTooltip: true },
    { prop: 'rushPrice', label: '抢购价格', type: 'money', width: 120, align: 'right' },
    { prop: 'receiverAddress', label: '收货地址', minWidth: 180, showOverflowTooltip: true },
    { prop: 'status', label: '订单状态', width: 120, align: 'center' },
    { prop: 'listingFee', label: '上架费', type: 'money', width: 120, align: 'right' },
    { prop: 'couponAmount', label: '优惠券金额', type: 'money', width: 130, align: 'right' },
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
