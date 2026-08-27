<script setup lang="tsx">
import {
  deleteProduct,
  fetchProductList,
  updateProductStatus,
} from '@/api/product/list';
import { renderIcon, useTable } from '@/components';
import { useConfirm } from '@/hooks/useConfirm';
import ProductForm from './components/productForm.vue';
import { useState } from './components/useState.ts';

defineOptions({ name: 'ProductList' });

const { showForm, setState } = useState();

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchProductList,
  apiParams: {
    goodsName: '',
    status: undefined,
  },
  isPagination: true,
  columns: () => [
    { type: 'index', fixed: 'left' },
    { prop: 'goodsName', label: '商品名称', width: 150, showOverflowTooltip: true },
    { type: 'img', prop: 'goodsThumb', label: '商品缩略图', width: 110 },
    { type: 'money', prop: 'price', label: '商品价格' },
    { prop: 'stock', label: '库存', width: 100 },
    { prop: 'sales', label: '销量', width: 100 },
    {
      prop: 'status',
      label: '商品状态',
      width: 100,
      align: 'center',
      renderContent: ({ row }) => (
        <ElTag type={row.status ? 'success' : 'info'}>
          {row.status ? '上架' : '下架'}
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
          label: ({ row }) => (row.status ? '下架' : '上架'),
          type: 'warning',
          icon: ({ row }) => `healthicons:${row.status ? 'no' : 'yes'}-outline`,
          onClick: async ({ row }) => {
            await updateProductStatus({ id: row.id, status: !row.status });
            await getTableData();
          },
        },
        {
          label: '删除',
          type: 'danger',
          icon: 'Delete',
          onClick: async ({ row }) => {
            await useConfirm(deleteProduct, row.id, '删除该商品');
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
        <app-form-item label="商品名称">
          <el-input v-model="params.goodsName" placeholder="请输入商品名称" />
        </app-form-item>
        <app-form-item label="商品状态">
          <el-select v-model="params.status" placeholder="请选商品状态">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
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
    <ProductForm @confirm="getTableData" />
  </div>
</template>
