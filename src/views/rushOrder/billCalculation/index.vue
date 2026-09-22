<script setup lang="tsx">
import { omit } from 'lodash-es';
import { exportRobOrderBillsPDF, fetchBillCalculationList } from '@/api/rushOrder/billCalculation';
import { PAGINATION_KEYS, renderIcon, useTable } from '@/components';
import { downloadFile } from '@/utils/download';
import { moneyThousand } from '@/utils/money';

defineOptions({ name: 'RushOrderBillCalculation' });

function renderAmount(amount: number, colorClass: string) {
  return <span class={['font-600', colorClass]}>{moneyThousand(amount)}</span>;
}

const { params, resetParams, tableProps, getTableData } = useTable({
  apiFunc: fetchBillCalculationList,
  apiParams: {
    date: '',
    keyword: '',
  },
  isPagination: true,
  columns: () => [
    {
      label: '用户',
      minWidth: 160,
      fixed: 'left',
      renderContent: ({ row }) => (
        <div class="font-600">
          #
          {row.userId}
          {' '}
          ·
          {' '}
          {row.userName}
        </div>
      ),
    },
    { prop: 'phone', label: '电话', width: 140, fixed: 'left' },
    {
      label: '今日',
      headerAlign: 'center',
      children: [
        {
          prop: 'todayPurchaseAmount',
          label: '买入',
          minWidth: 120,
          align: 'right',
          renderContent: ({ row }) => renderAmount(row.todayPurchaseAmount, 'text-[var(--el-color-primary)]'),
        },
        {
          prop: 'todayConsignmentAmount',
          label: '寄售',
          minWidth: 120,
          align: 'right',
          helpInfo: '自购奖金额：今日回款金额 - 今日付款金额',
          renderContent: ({ row }) => renderAmount(row.todayConsignmentAmount, 'text-[var(--el-color-warning)]'),
        },
        {
          prop: 'todayPaymentAmount',
          label: '付款',
          minWidth: 120,
          align: 'right',
          renderContent: ({ row }) => renderAmount(row.todayPaymentAmount, 'text-[var(--el-color-warning)]'),
        },
        {
          prop: 'todayReceiptAmount',
          label: '回款',
          minWidth: 120,
          align: 'right',
          renderContent: ({ row }) => renderAmount(row.todayReceiptAmount, 'text-[var(--el-color-success)]'),
        },
        {
          prop: 'todayShareAmount',
          label: '分享',
          minWidth: 120,
          align: 'right',
          helpInfo: '推荐奖金额',
          renderContent: ({ row }) => renderAmount(row.todayShareAmount, 'text-[var(--el-color-warning)]'),
        },
      ],
    },
    {
      label: '昨日',
      headerAlign: 'center',
      children: [
        {
          prop: 'yesterdayPurchaseAmount',
          label: '买入',
          minWidth: 120,
          align: 'right',
          renderContent: ({ row }) => renderAmount(row.yesterdayPurchaseAmount, 'text-[var(--el-color-primary)]'),
        },
        {
          prop: 'yesterdayConsignmentAmount',
          label: '寄售',
          minWidth: 120,
          align: 'right',
          helpInfo: '自购奖金额：昨日回款金额 - 昨日付款金额',
          renderContent: ({ row }) => renderAmount(row.yesterdayConsignmentAmount, 'text-[var(--el-color-warning)]'),
        },
        {
          prop: 'yesterdayPaymentAmount',
          label: '付款',
          minWidth: 120,
          align: 'right',
          renderContent: ({ row }) => renderAmount(row.yesterdayPaymentAmount, 'text-[var(--el-color-warning)]'),
        },
        {
          prop: 'yesterdayReceiptAmount',
          label: '回款',
          minWidth: 120,
          align: 'right',
          renderContent: ({ row }) => renderAmount(row.yesterdayReceiptAmount, 'text-[var(--el-color-success)]'),
        },
      ],
    },
    {
      prop: 'payableAmount',
      label: '应付款',
      minWidth: 120,
      fixed: 'right',
      align: 'right',
      helpInfo: '回款计为负数，收款计为正数',
      renderContent: ({ row }) => renderAmount(
        row.payableAmount,
        row.payableAmount < 0 ? 'text-[var(--el-color-danger)]' : 'text-[var(--el-color-warning)]',
      ),
    },
  ],
});

async function handleExport() {
  const file = await exportRobOrderBillsPDF(omit(params.value, PAGINATION_KEYS));
  downloadFile(file, '账单计算.pdf');
}
</script>

<template>
  <div class="main-container">
    <app-card>
      <app-form show-action inline :loading="tableProps.loading" @search="getTableData" @reset="resetParams">
        <app-form-item label="统计日期">
          <el-date-picker
            v-model="params.date" clearable placeholder="请选择统计日期" type="date"
            value-format="YYYY-MM-DD"
          />
        </app-form-item>
        <app-form-item label="买家信息">
          <el-input v-model="params.keyword" clearable placeholder="请输入买家姓名或手机号" />
        </app-form-item>
      </app-form>
    </app-card>
    <app-table v-bind="tableProps" :data="tableProps.data" card @refresh="getTableData">
      <template #button>
        <el-button type="primary" :icon="renderIcon('Download')" @click="handleExport">
          导出 PDF
        </el-button>
      </template>
    </app-table>
  </div>
</template>
