<script setup lang="tsx">
import type { RobOrderFlowSummary } from '@/api/rushOrder/orderFlow';
import { fetchRobOrderFlowList, fetchRobOrderFlowSummary } from '@/api/rushOrder/orderFlow';
import { useTable } from '@/components';
import { useDatePickerShortcuts } from '@/hooks/useDatePickerShortcuts';
import { timeFormat } from '@/utils/date.ts';
import { moneyThousand } from '@/utils/money';
import OrderFlowDetailDrawer from './components/orderFlowDetailDrawer.vue';

defineOptions({ name: 'RushOrderOrderFlow' });

const detailDrawerRef = useTemplateRef<InstanceType<typeof OrderFlowDetailDrawer>>('detailDrawerRef');
const { shortcuts: dateShortcuts } = useDatePickerShortcuts();
const summary = ref<RobOrderFlowSummary>({
  net: {
    totalAmount: 0,
  },
  totalReceiptAmount: 0,
  stationServiceFee: 0,
  techServiceFee: 0,
  salesAward: 0,
  orderProfitDiff: 0,
  totalPaymentAmount: 0,
});
const summaryLoading = ref(false);

const summaryItems = computed(() => [
  { label: '总订单金额', amount: summary.value.net.totalAmount, colorClass: 'text-[var(--el-color-primary)]' },
  { label: '回款总金额', amount: summary.value.totalReceiptAmount, colorClass: 'text-[var(--el-color-success)]' },
  { label: '站长服务费', amount: summary.value.stationServiceFee, colorClass: 'text-[var(--el-color-warning)]' },
  { label: '技术服务费', amount: summary.value.techServiceFee, colorClass: 'text-[var(--el-color-warning)]' },
  { label: '销售奖', amount: summary.value.salesAward, colorClass: 'text-[var(--el-color-warning)]' },
  {
    label: '订单利润差',
    amount: summary.value.orderProfitDiff,
    colorClass: summary.value.orderProfitDiff < 0 ? 'text-[var(--el-color-danger)]' : 'text-[var(--el-color-primary)]',
  },
  { label: '付款总金额', amount: summary.value.totalPaymentAmount, colorClass: 'text-[var(--el-color-primary)]' },
]);

function renderAmount(amount: number, colorClass: string) {
  return <span class={['font-600', colorClass]}>{moneyThousand(amount)}</span>;
}

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchRobOrderFlowList,
  apiParams: {
    operateType: undefined,
    timeRange: [timeFormat(), timeFormat()],
    keyword: '',
  },
  isPagination: true,
  columns: () => [
    {
      label: '商品',
      minWidth: 200,
      fixed: 'left',
      showOverflowTooltip: true,
      renderContent: ({ row }) => (
        <div class="flex items-center gap-8">
          <ElImage
            class="h-40 w-40 shrink-0"
            src={row.goodsThumb}
            fit="cover"
            preview-src-list={[row.goodsThumb]}
            preview-teleported
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
    { type: 'dateTime', prop: 'eventTime', label: '购买时间', minWidth: 180 },
    {
      label: '购买用户',
      minWidth: 160,
      renderContent: ({ row }) => (
        <div>
          <div class="font-600">
            #
            {row.buyerId}
            {' '}
            ·
            {' '}
            {row.buyerName}
          </div>
          <div class="text-12 text-gray-400">{row.buyerPhone}</div>
        </div>
      ),
    },
    {
      prop: 'signedTotalAmount',
      label: '订单金额',
      minWidth: 120,
      align: 'right',
      renderContent: ({ row }) => renderAmount(
        row.signedTotalAmount,
        row.signedTotalAmount < 0 ? 'text-[var(--el-color-danger)]' : 'text-[var(--el-color-primary)]',
      ),
    },
    {
      prop: 'paymentAmount',
      label: '付款金额',
      minWidth: 120,
      align: 'right',
      renderContent: ({ row }) => renderAmount(row.paymentAmount, 'text-[var(--el-color-warning)]'),
    },
    {
      prop: 'receiptRoundAmount',
      label: '回款金额',
      minWidth: 120,
      align: 'right',
      helpInfo: '（付款金额 + 自购奖）* 数量',
      renderContent: ({ row }) => renderAmount(row.receiptRoundAmount, 'text-[var(--el-color-success)]'),
    },
    { prop: 'sessionName', label: '场次', minWidth: 180, showOverflowTooltip: true },
    { prop: 'remark', label: '备注', minWidth: 180, showOverflowTooltip: true },
    {
      label: '操作',
      type: 'operation',
      fixed: 'right',
      width: 100,
      align: 'center',
      buttons: [
        {
          label: '查看详情',
          icon: 'View',
          onClick: ({ row }) => detailDrawerRef.value?.open(row),
        },
      ],
    },
  ],
});

async function getSummary() {
  summaryLoading.value = true;
  try {
    const { data } = await fetchRobOrderFlowSummary({
      timeRange: params.value.timeRange.filter(Boolean).join(',') || undefined,
    });
    summary.value = data;
  }
  finally {
    summaryLoading.value = false;
  }
}

async function refreshData(pageIndex?: number) {
  await Promise.all([getTableData(pageIndex), getSummary()]);
}

onMounted(() => {
  getSummary();

  onActivated(() => {
    getSummary();
  });
});
</script>

<template>
  <div class="main-container">
    <app-card>
      <app-form
        show-action inline :loading="tableProps.loading || summaryLoading" @search="refreshData"
        @reset="resetParams"
      >
        <app-form-item label="关键字">
          <el-input v-model="params.keyword" clearable placeholder="请输入买家信息" />
        </app-form-item>
        <app-form-item label="订单类型">
          <el-select v-model="params.operateType" clearable placeholder="请选择订单类型">
            <el-option label="下单" :value="1" />
            <el-option label="取消订单" :value="2" />
            <el-option label="转移订单" :value="3" />
          </el-select>
        </app-form-item>
        <app-form-item label="日期">
          <el-date-picker
            v-model="params.timeRange" type="daterange" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="YYYY-MM-DD" :shortcuts="dateShortcuts"
          />
        </app-form-item>
      </app-form>
    </app-card>
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="refreshData">
      <template #header>
        <app-flex align="center" :size="16" wrap>
          <span class="text-16 font-600">汇总：</span>
          <app-flex v-for="item in summaryItems" :key="item.label" align="center" :size="8">
            <span class="text-14 text-[var(--el-text-color-secondary)]">{{ item.label }}</span>
            <span class="text-16 font-600" :class="item.colorClass">¥{{ moneyThousand(item.amount) }}</span>
          </app-flex>
        </app-flex>
      </template>
    </app-table>
    <OrderFlowDetailDrawer ref="detailDrawerRef" />
  </div>
</template>
