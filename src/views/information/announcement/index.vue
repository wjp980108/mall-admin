<script setup lang="tsx">
import { deleteAnnouncement, fetchAnnouncementList } from '@/api/information/announcement';
import { renderIcon, useTable } from '@/components';
import { informationPosition } from '@/constants/information';
import { useConfirm } from '@/hooks/useConfirm';
import AnnouncementForm from './components/announcementForm.vue';
import { useState } from './components/useState.ts';

defineOptions({ name: 'AnnouncementList' });

const { showForm, setState } = useState();

const { tableProps, getTableData } = useTable({
  apiFunc: fetchAnnouncementList,
  apiParams: {},
  isPagination: true,
  columns: () => [
    { type: 'index', fixed: 'left' },
    { prop: 'title', label: '标题', width: 200, showOverflowTooltip: true },
    {
      prop: 'content',
      label: '公告内容',
      width: 500,
      renderContent: ({ row }) => {
        return <dev vHtml={row.content} />;
      },
    },
    {
      prop: 'position',
      label: '位置',
      renderContent: ({ row }) => informationPosition[row.position] || row.position || '-',
    },
    { type: 'dateTime', prop: 'createTime', label: '添加时间' },
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
            await useConfirm(deleteAnnouncement, row.id, '删除该公告');
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
          新增公告
        </el-button>
      </template>
    </app-table>
    <AnnouncementForm @confirm="getTableData" />
  </div>
</template>
