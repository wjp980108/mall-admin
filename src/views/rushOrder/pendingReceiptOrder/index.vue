<script setup lang="tsx">
import {
  cancelPendingReceiptOrder,
  confirmPendingReceiptOrder,
  fetchPendingReceiptOrderList,
} from '@/api/rushOrder/pendingReceiptOrder';
import { useTable } from '@/components';
import { useConfirm } from '@/hooks/useConfirm';

defineOptions({ name: 'RushOrderPendingReceiptOrder' });

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchPendingReceiptOrderList,
  apiParams: {
    orderNo: '',
    timeRange: ['', ''],
  },
  isPagination: true,
  columns: () => [
    { prop: 'orderNo', label: '订单号', width: 170, fixed: 'left' },
    { prop: 'goodsName', label: '商品名称', minWidth: 160, showOverflowTooltip: true },
    { prop: 'buyerName', label: '购买人', minWidth: 120, showOverflowTooltip: true },
    { type: 'money', prop: 'productPrice', label: '商品单价' },
    { prop: 'quantity', label: '购买数量', width: 100 },
    { type: 'money', prop: 'totalAmount', label: '订单金额' },
    { prop: 'orderStatusName', label: '订单状态', width: 120, align: 'center' },
    { prop: 'receiverName', label: '收货人', width: 120, showOverflowTooltip: true },
    { prop: 'buyerPhone', label: '收货手机号', width: 140 },
    { prop: 'receiveAddress', label: '收货地址', minWidth: 180, showOverflowTooltip: true },
    { type: 'dateTime', prop: 'createTime', label: '下单时间' },
    {
      label: '操作',
      type: 'operation',
      fixed: 'right',
      width: 160,
      align: 'center',
      buttons: [
        {
          label: '确认',
          icon: 'CircleCheck',
          onClick: async ({ row }) => {
            await useConfirm(confirmPendingReceiptOrder, row.id, '确认该订单');
            await getTableData();
          },
        },
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
  </div>
</template>
