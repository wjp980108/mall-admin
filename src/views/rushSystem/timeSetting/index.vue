<script setup lang="tsx">
import {
  deleteRushTimeSetting,
  fetchRushTimeSettingList,
  updateRushTimeSettingStatus,
} from '@/api/rushSystem/timeSetting';
import { renderIcon, useTable } from '@/components';
import { useConfirm } from '@/hooks/useConfirm';
import RushTimeSettingForm from './components/rushTimeSettingForm.vue';
import { useState } from './components/useState.ts';

defineOptions({ name: 'RushTimeSetting' });

const { showForm, setState } = useState();

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchRushTimeSettingList,
  apiParams: {
    sessionName: '',
    sessionStatus: undefined,
  },
  isPagination: true,
  columns: () => [
    { type: 'index', fixed: 'left' },
    { prop: 'sessionName', label: '场次名称', minWidth: 130, showOverflowTooltip: true, fixed: 'left' },
    {
      label: '抢购时间',
      width: 130,
      align: 'center',
      renderContent: ({ row }) => (<>{`${row.rushStartTime} 至 ${row.rushEndTime}`}</>),
    },
    {
      prop: 'enterControlMinute',
      label: '进场时间控制',
      helpInfo: '单位：分钟',
      width: 130,
      align: 'center',
    },
    { prop: 'maxBuyCount', label: '最多购买次数', width: 120 },
    {
      prop: 'beforeForbidMinute',
      label: '开场前禁止委托时间',
      helpInfo: '单位：分钟',
      width: 170,
      align: 'center',
    },
    {
      prop: 'afterForbidMinute',
      label: '结束后禁止委托时间',
      helpInfo: '单位：分钟',
      width: 170,
      align: 'center',
    },
    { type: 'img', prop: 'bgImg', label: '场次背景图', width: 120 },
    {
      prop: 'status',
      label: '场次状态',
      width: 100,
      align: 'center',
      renderContent: ({ row }) => (
        <ElTag type={row.sessionStatus ? 'success' : 'info'}>
          {row.sessionStatus ? '启用' : '禁用'}
        </ElTag>
      ),
    },
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
          label: ({ row }) => (row.sessionStatus ? '禁用' : '启用'),
          type: 'warning',
          icon: ({ row }) => `healthicons:${row.sessionStatus ? 'no' : 'yes'}-outline`,
          onClick: async ({ row }) => {
            await updateRushTimeSettingStatus({ id: row.id, status: !row.sessionStatus });
            await getTableData();
          },
        },
        {
          label: '删除',
          type: 'danger',
          icon: 'Delete',
          onClick: async ({ row }) => {
            await useConfirm(deleteRushTimeSetting, row.id, '删除该抢购时间设置');
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
        <app-form-item label="场次名称">
          <el-input v-model="params.sessionName" placeholder="请输入场次名称" />
        </app-form-item>
        <app-form-item label="场次状态">
          <el-select v-model="params.sessionStatus" placeholder="请选择场次状态">
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </app-form-item>
      </app-form>
    </app-card>
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="getTableData">
      <template #button>
        <el-button type="primary" :icon="renderIcon('CirclePlus')" plain @click="showForm = true">
          新增抢购时间
        </el-button>
      </template>
    </app-table>
    <RushTimeSettingForm @confirm="getTableData" />
  </div>
</template>
