<script setup lang="tsx">
import {
  deleteRushProduct,
  fetchRushProductList,
  updateRushProductStatus,
} from '@/api/product/rushList.ts';
import { renderIcon, useTable } from '@/components';
import { useConfirm } from '@/hooks/useConfirm';
import RushProductForm from './components/rushProductForm.vue';
import { useState } from './components/useState.ts';

defineOptions({ name: 'RushProductList' });

const { showForm, setState } = useState();

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchRushProductList,
  apiParams: {
    goodsName: '',
    consignorPhone: '',
  },
  isPagination: true,
  columns: () => [
    { type: 'index', fixed: 'left' },
    { prop: 'goodsName', label: '商品名称', width: 160, showOverflowTooltip: true },
    { type: 'money', prop: 'goodsPrice', label: '商品价格' },
    { type: 'img', prop: 'coverImg', label: '商品缩略图', width: 110 },
    { prop: 'consignmentSaleCount', label: '委托售卖次数', width: 130 },
    { prop: 'phone', label: '委托人手机号', width: 140 },
    { prop: 'nickname', label: '委托人姓名', width: 120 },
    { prop: 'currentStatus', label: '商品当前状态', width: 130, showOverflowTooltip: true },
    {
      prop: 'status',
      label: '上架状态',
      width: 100,
      align: 'center',
      renderContent: ({ row }) => (
        <ElTag type={row.onlineStatus ? 'success' : 'info'}>
          {row.onlineStatus ? '上架' : '下架'}
        </ElTag>
      ),
    },
    { type: 'dateTime', prop: 'createTime', label: '添加时间' },
    {
      label: '操作',
      type: 'operation',
      fixed: 'right',
      width: 190,
      align: 'center',
      buttons: [
        {
          label: '编辑',
          icon: 'EditPen',
          onClick: ({ row }) => setState(row),
        },
        {
          label: ({ row }) => (row.onlineStatus ? '下架' : '上架'),
          type: 'warning',
          icon: ({ row }) => `healthicons:${row.onlineStatus ? 'no' : 'yes'}-outline`,
          onClick: async ({ row }) => {
            await updateRushProductStatus({ id: row.id, onlineStatus: !row.onlineStatus });
            await getTableData();
          },
        },
        {
          label: '删除',
          type: 'danger',
          icon: 'Delete',
          onClick: async ({ row }) => {
            await useConfirm(deleteRushProduct, row.id, '删除该商品');
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
        :loading="tableProps.loading" show-action label-width="" inline @search="getTableData"
        @reset="resetParams"
      >
        <app-form-item label="商品名称">
          <el-input v-model="params.goodsName" placeholder="请输入商品名称" clearable />
        </app-form-item>
        <app-form-item label="委托人手机号">
          <el-input v-model="params.consignorPhone" placeholder="请输入委托人手机号" clearable />
        </app-form-item>
      </app-form>
    </app-card>
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="getTableData">
      <template #button>
        <el-button type="primary" :icon="renderIcon('CirclePlus')" plain @click="showForm = true">
          新增商品
        </el-button>
      </template>
    </app-table>
    <RushProductForm @confirm="getTableData" />
  </div>
</template>
