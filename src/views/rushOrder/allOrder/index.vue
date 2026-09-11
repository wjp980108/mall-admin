<script setup lang="tsx">
import type { RobOrderItem, UserOption } from '@/api/rushOrder/allOrder';
import {
  cancelRobOrder,
  fetchRobOrderList,
  fetchUserOptions,
  transferRobOrder,
} from '@/api/rushOrder/allOrder';
import { useTable } from '@/components';
import { useConfirm } from '@/hooks/useConfirm';

defineOptions({ name: 'RushOrderAllOrder' });

const ORDER_STATUS_MAP = {
  1: { label: '正常', type: 'success' },
  2: { label: '已取消', type: 'info' },
} as const;

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchRobOrderList,
  apiParams: {
    timeRange: ['', ''],
    keyword: '',
    orderStatus: undefined,
  },
  isPagination: true,
  columns: () => [
    {
      prop: 'orderNo',
      label: '订单',
      minWidth: 180,
      fixed: 'left',
      renderContent: ({ row }) => (
        <div>
          <div class="font-600">{row.orderNo}</div>
          <div class="text-12 text-gray-400">{row.createTime}</div>
        </div>
      ),
    },
    {
      label: '购买者',
      minWidth: 180,
      renderContent: ({ row }) => (
        <div class="flex items-center gap-8">
          <ElAvatar size={40} src={row.buyerAvatar}>{row.buyerName.slice(0, 1)}</ElAvatar>
          <div>
            <div class="font-600">
              #
              {row.buyerId}
              {' '}
              ·
              {row.buyerName}
            </div>
            <div class="text-12 text-gray-400">{row.buyerPhone}</div>
          </div>
        </div>
      ),
    },
    { prop: 'receiverName', label: '收货人', width: 120, showOverflowTooltip: true },
    { prop: 'buyerPhone', label: '收货手机号', width: 140 },
    { prop: 'receiveAddress', label: '收货地址', minWidth: 180, showOverflowTooltip: true },
    {
      label: '所属场次',
      minWidth: 160,
      renderContent: ({ row }) => (
        <div>
          <div class="font-600">{row.sessionName}</div>
          <div class="text-12 text-gray-400">
            {row.rushStartTime}
            {' '}
            ~
            {' '}
            {row.rushEndTime}
          </div>
        </div>
      ),
    },
    {
      label: '商品',
      minWidth: 180,
      showOverflowTooltip: true,
      renderContent: ({ row }) => (
        <div class="flex items-center gap-8">
          <ElImage
            class="h-40 w-40 shrink-0"
            src={row.goodsThumb}
            fit="cover"
            preview-src-list={[row.goodsThumb]}
          />
          <div class="min-w-0">
            <div class="truncate">{row.goodsName}</div>
            <div class="text-12 text-gray-400">
              {row.goodsSn}
              {' '}
              ×
              {' '}
              {row.quantity}
            </div>
          </div>
        </div>
      ),
    },
    { type: 'money', prop: 'totalAmount', label: '金额', minWidth: 120 },
    {
      label: '推荐奖',
      minWidth: 150,
      renderContent: ({ row }) => (
        <div>
          <div>{row.inviterId ? `#${row.inviterId} · ${row.inviterName}` : '无推荐人'}</div>
          <div class="text-danger text-12">
            ¥
            {row.recommendAmount}
          </div>
        </div>
      ),
    },
    { type: 'money', prop: 'profitAmount', label: '利润', minWidth: 120 },
    {
      label: '状态',
      width: 100,
      align: 'center',
      renderContent: ({ row }) => {
        const status = ORDER_STATUS_MAP[row.orderStatus];
        return <ElTag type={status.type}>{row.orderStatusName || status.label}</ElTag>;
      },
    },
    {
      label: '操作',
      type: 'operation',
      fixed: 'right',
      width: 180,
      align: 'center',
      buttons: [
        {
          label: '转移订单',
          icon: 'Switch',
          show: ({ row }) => row.orderStatus === 1,
          auth: 'system:allOrder:shift',
          onClick: ({ row }) => openTransfer(row),
        },
        {
          label: '取消订单',
          type: 'danger',
          icon: 'CircleClose',
          show: ({ row }) => row.orderStatus === 1,
          auth: 'system:allOrder:cancel',
          onClick: async ({ row }) => {
            await useConfirm(cancelRobOrder, row.id, '取消该订单');
            await getTableData();
          },
        },
      ],
    },
  ],
});

const userOptions = ref<UserOption[]>([]);
const transferVisible = ref(false);
const transferLoading = ref(false);
const transferForm = reactive({
  orderId: 0,
  newBuyerId: undefined as number | undefined,
});

async function openTransfer(row: RobOrderItem) {
  transferForm.orderId = row.id;
  transferForm.newBuyerId = undefined;

  if (!userOptions.value.length) {
    const { data } = await fetchUserOptions();
    userOptions.value = data;
  }

  transferVisible.value = true;
}

async function handleTransfer() {
  if (!transferForm.newBuyerId) {
    ElMessage.warning('请选择转移后的用户');
    return;
  }

  transferLoading.value = true;
  try {
    await transferRobOrder({
      orderId: transferForm.orderId,
      newBuyerId: transferForm.newBuyerId,
    });
    transferVisible.value = false;
    await getTableData();
  }
  finally {
    transferLoading.value = false;
  }
}
</script>

<template>
  <div class="main-container">
    <app-card>
      <app-form
        show-action inline :loading="tableProps.loading" @search="getTableData" @reset="resetParams"
      >
        <app-form-item label="搜索关键词">
          <el-input v-model="params.keyword" clearable placeholder="请输入关键词" />
        </app-form-item>
        <app-form-item label="下单时间">
          <el-date-picker
            v-model="params.timeRange" type="daterange" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="YYYY-MM-DD"
          />
        </app-form-item>
        <app-form-item label="订单状态">
          <el-select v-model="params.orderStatus" clearable placeholder="请选择订单状态">
            <el-option label="正常" :value="1" />
            <el-option label="已取消" :value="2" />
          </el-select>
        </app-form-item>
      </app-form>
    </app-card>
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="getTableData" />

    <app-popup
      v-model="transferVisible" title="转移订单" confirm-text="确认转移" width="450"
      :loading="transferLoading" @confirm="handleTransfer"
    >
      <app-form label-width="100px">
        <app-form-item label="转移给用户">
          <el-select
            v-model="transferForm.newBuyerId" class="w-full" filterable
            placeholder="请选择用户"
          >
            <el-option
              v-for="item in userOptions" :key="item.value" :label="item.label"
              :value="item.value"
            />
          </el-select>
        </app-form-item>
      </app-form>
    </app-popup>
  </div>
</template>
