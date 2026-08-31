<script setup lang="tsx">
import {
  cancelPendingReceiptOrder,
  deletePendingPaymentOrder,
  fetchPendingPaymentOrderList,
} from '@/api/rushOrder/pendingPaymentOrder';
import { useTable } from '@/components';
import PendingPaymentOrderForm from './components/pendingPaymentOrderForm.vue';
import { useState } from './components/useState.ts';

defineOptions({ name: 'RushOrderPendingPaymentOrder' });

const { setState } = useState();

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchPendingPaymentOrderList,
  apiParams: {
    orderNo: '',
    timeRange: ['', ''],
  },
  isPagination: true,
  columns: () => [
    { prop: 'orderNo', label: '订单号', width: 170, fixed: 'left' },
    { prop: 'goodsName', label: '商品名称', width: 160, showOverflowTooltip: true },
    { type: 'money', prop: 'price', label: '价格' },
    { type: 'dateTime', prop: 'bidAt', label: '拍下时间' },
    { prop: 'remainingPaymentTime', label: '当前剩余付款时间', width: 160 },
    { prop: 'buyerId', label: '买家ID', width: 120 },
    { prop: 'buyerPhone', label: '买家手机号', width: 140 },
    { prop: 'buyerName', label: '买家姓名', width: 120, showOverflowTooltip: true },
    { prop: 'buyerParentNickname', label: '买家上级昵称', width: 140, showOverflowTooltip: true },
    { prop: 'buyerTopNickname', label: '买家顶级昵称', width: 140, showOverflowTooltip: true },
    { prop: 'sellerId', label: '卖家ID', width: 120 },
    { prop: 'sellerPhone', label: '卖家手机号', width: 140 },
    { prop: 'sellerName', label: '卖家姓名', width: 120, showOverflowTooltip: true },
    {
      label: '操作',
      type: 'operation',
      fixed: 'right',
      width: 220,
      align: 'center',
      buttons: [
        {
          label: '取消订单',
          type: 'danger',
          icon: 'CircleClose',
          onClick: async ({ row }) => {
            const res = await ElMessageBox.prompt('温馨提示', '是否取消该订单', {
              inputErrorMessage: '请输入取消订单备注',
              inputPlaceholder: '请输入备注',
              type: 'warning',
            });
            await cancelPendingReceiptOrder({
              id: row.id,
              remark: res.value,
            });
            await getTableData();
          },
        },
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
            const res = await ElMessageBox.prompt('温馨提示', '是否删除该订单', {
              inputErrorMessage: '请输入删除订单备注',
              inputPlaceholder: '请输入备注',
              type: 'warning',
            });
            await deletePendingPaymentOrder({
              id: row.id,
              remark: res.value,
            });
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
      <app-form
        show-action inline :loading="tableProps.loading" @search="getTableData"
        @reset="resetParams"
      >
        <app-form-item label="订单号">
          <el-input v-model="params.orderNo" placeholder="请输入订单号" />
        </app-form-item>
        <app-form-item label="下单时间">
          <el-date-picker
            v-model="params.timeRange" type="daterange" start-placeholder="开始时间"
            end-placeholder="结束时间" value-format="YYYY-MM-DD"
          />
        </app-form-item>
      </app-form>
    </app-card>
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="getTableData" />
    <PendingPaymentOrderForm @confirm="getTableData" />
  </div>
</template>
