<script setup lang="tsx">
import { fetchRushConsignmentRecordList } from '@/api/rushOrder/consignmentRecord';
import { useTable } from '@/components';

defineOptions({ name: 'RushConsignmentRecord' });

const { params, resetParams, tableProps, getTableData } = useTable({
  apiFunc: fetchRushConsignmentRecordList,
  apiParams: {
    orderNo: '',
    orderStatus: '',
    timeRange: ['', ''],
  },
  isPagination: true,
  columns: () => [
    { prop: 'orderNo', label: '订单号', width: 170, fixed: 'left' },
    { prop: 'buyerId', label: '买家ID', width: 120 },
    { prop: 'buyerPhone', label: '买家收款手机号', width: 130 },
    { prop: 'buyerName', label: '买家姓名', width: 120, showOverflowTooltip: true },
    { prop: 'sellerId', label: '卖家ID', width: 120 },
    { prop: 'sellerPhone', label: '卖家收款手机号', width: 130 },
    { prop: 'sellerName', label: '卖家姓名', width: 120, showOverflowTooltip: true },
    { prop: 'goodsId', label: '商品ID', width: 120 },
    { prop: 'goodsName', label: '商品名', minWidth: 160, showOverflowTooltip: true },
    { type: 'money', prop: 'rushPrice', label: '商品价格' },
    { type: 'money', prop: 'putCommission', label: '上架手续费' },
    { prop: 'consignmentType', label: '委托类型', width: 120 },
    { prop: 'reviewStatus', label: '审核状态', width: 120 },
    { type: 'dateTime', prop: 'createTime', label: '下单时间' },
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
        <app-form-item label="订单状态">
          <el-select v-model="params.orderStatus" placeholder="请选择订单状态" formatter>
            <el-option label="待付款" :value="1" />
            <el-option label="已付款" :value="2" />
            <el-option label="已确认" :value="3" />
            <el-option label="已代售" :value="4" />
            <el-option label="已取消" :value="5" />
          </el-select>
        </app-form-item>
      </app-form>
    </app-card>
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="getTableData" />
  </div>
</template>
