<script setup lang="tsx">
import { deleteCarousel, fetchCarouselList } from '@/api/information/carousel';
import { renderIcon, useTable } from '@/components';
import { informationPosition } from '@/constants/information';
import { useConfirm } from '@/hooks/useConfirm';
import CarouselForm from './components/carouselForm.vue';
import { useState } from './components/useState.ts';

defineOptions({ name: 'CarouselList' });

const { showForm, setState } = useState();

const { tableProps, getTableData } = useTable({
  apiFunc: fetchCarouselList,
  isPagination: true,
  columns: () => [
    { type: 'index', fixed: 'left' },
    { type: 'img', prop: 'imgUrl', label: '轮播图', width: 80 },
    {
      prop: 'position',
      label: '位置',
      renderContent: ({ row }) => informationPosition[row.position] || row.position || '-',
    },
    { type: 'dateTime', prop: 'createdTime', label: '添加时间' },
    {
      label: '操作',
      type: 'operation',
      fixed: 'right',
      width: 120,
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
            await useConfirm(deleteCarousel, row.id, '删除该轮播图');
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
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="getTableData">
      <template #button>
        <el-button type="primary" :icon="renderIcon('CirclePlus')" plain @click="showForm = true">
          新增轮播图
        </el-button>
      </template>
    </app-table>
    <CarouselForm @confirm="getTableData" />
  </div>
</template>
