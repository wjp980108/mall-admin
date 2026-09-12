<script setup lang="tsx">
import { fetchRobOrderFlowList, fetchRobOrderFlowSummary } from '@/api/rushOrder/orderFlow';
import { useTable } from '@/components';
import { useDatePickerShortcuts } from '@/hooks/useDatePickerShortcuts';
import { moneyThousand } from '@/utils/money';
import OrderFlowDetailDrawer from './components/orderFlowDetailDrawer.vue';

defineOptions({ name: 'RushOrderOrderFlow' });

const detailDrawerRef = useTemplateRef<InstanceType<typeof OrderFlowDetailDrawer>>('detailDrawerRef');
const { shortcuts: dateShortcuts } = useDatePickerShortcuts();
const totalAmount = ref(0);
const summaryLoading = ref(false);

const formattedTotalAmount = computed(() => moneyThousand(totalAmount.value));

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchRobOrderFlowList,
  apiParams: {
    operateType: undefined,
    timeRange: ['', ''],
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
      type: 'money',
      prop: 'signedTotalAmount',
      label: '订单金额',
      minWidth: 120,
      money: { highlightNegativeAmounts: true },
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
    totalAmount.value = data.net.totalAmount;
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
      <template #header-left>
        <app-flex align="center">
          <span>汇总：</span>
          <app-flex align="center" :size="8">
            <span class="text-14 text-[var(--el-text-color-secondary)]">总订单金额</span>
            <span class="text-16 text-[var(--el-color-primary)] font-600">¥{{ formattedTotalAmount }}</span>
          </app-flex>
        </app-flex>
      </template>
    </app-table>
    <OrderFlowDetailDrawer ref="detailDrawerRef" />
  </div>
</template>
