<script setup lang="tsx">
import type { TableInstance } from 'element-plus';
import type {
  InsufficientPointsUser,
  RobOrderBatchInsufficient,
  RobOrderItem,
  RobOrderOperationData,
  UserOption,
} from '@/api/rushOrder/allOrder';
import {
  cancelRobOrder,
  confirmRobOrderPay,
  fetchRobOrderList,
  fetchUserOptions,
  transferRobOrder,
} from '@/api/rushOrder/allOrder';
import { useTable } from '@/components';
import { moneyThousand } from '@/utils/money';

defineOptions({ name: 'RushOrderAllOrder' });

const ORDER_STATUS_MAP = {
  1: { label: '正常', type: 'success' },
  2: { label: '已取消', type: 'info' },
} as const;

const PAY_STATUS_MAP = {
  0: { label: '未收款', type: 'warning' },
  1: { label: '已收款', type: 'primary' },
  2: { label: '已回款', type: 'success' },
  3: { label: '无效', type: 'info' },
} as const;

function renderAmount(amount: number, colorClass: string) {
  return (
    <span class={['font-600', colorClass]}>
      {moneyThousand(amount)}
    </span>
  );
}

const { tableProps, params, resetParams, getTableData } = useTable({
  apiFunc: fetchRobOrderList,
  apiParams: {
    timeRange: ['', ''],
    keyword: '',
    orderStatus: undefined,
    payStatus: undefined,
  },
  isPagination: true,
  columns: () => [
    {
      type: 'selection',
      width: 52,
      fixed: 'left',
      selectable: row => isOrderSelectable(row),
    },
    {
      prop: 'orderNo',
      label: '订单',
      minWidth: 200,
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
    {
      prop: 'totalAmount',
      label: '金额',
      minWidth: 120,
      align: 'right',
      renderContent: ({ row }) => renderAmount(row.totalAmount, 'text-[var(--el-color-primary)]'),
    },
    {
      label: '推荐奖',
      minWidth: 150,
      renderContent: ({ row }) => (
        <div>
          <div>{row.inviterId ? `#${row.inviterId} · ${row.inviterName}` : '无推荐人'}</div>
          <div class="text-12">
            {renderAmount(row.recommendAmount, 'text-[var(--el-color-warning)]')}
          </div>
        </div>
      ),
    },
    {
      prop: 'profitAmount',
      label: '利润',
      minWidth: 120,
      align: 'right',
      renderContent: ({ row }) => renderAmount(row.profitAmount, 'text-[var(--el-color-success)]'),
    },
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
      label: '收款/回款状态',
      width: 120,
      fixed: 'right',
      align: 'center',
      renderContent: ({ row }) => {
        const status = PAY_STATUS_MAP[row.payStatus];
        return <ElTag type={status.type}>{status.label}</ElTag>;
      },
    },
    {
      label: '操作',
      type: 'operation',
      fixed: 'right',
      width: 280,
      align: 'center',
      buttons: [
        {
          label: '确认收款',
          icon: 'CircleCheck',
          show: ({ row }) => row.orderStatus === 1 && row.payStatus === 0,
          auth: 'system:allOrder:confirmReceive',
          onClick: ({ row }) => handleConfirmPay([row.id], 1),
        },
        {
          label: '确认回款',
          icon: 'CircleCheck',
          show: ({ row }) => row.orderStatus === 1 && row.payStatus === 1,
          auth: 'system:allOrder:confirmPayback',
          onClick: ({ row }) => handleConfirmPay([row.id], 2),
        },
        {
          label: '转移订单',
          icon: 'Switch',
          show: ({ row }) => row.orderStatus === 1 && row.payStatus === 0,
          auth: 'system:allOrder:shift',
          onClick: ({ row }) => openTransfer(row),
        },
        {
          label: '取消订单',
          type: 'danger',
          icon: 'CircleClose',
          show: ({ row }) => row.orderStatus === 1 && (row.payStatus === 0 || row.payStatus === 1),
          auth: 'system:allOrder:cancel',
          onClick: ({ row }) => handleCancel([row]),
        },
      ],
    },
  ],
});

const orderTableRef = useTemplateRef<TableInstance>('orderTableRef');
const selectedRows = ref<RobOrderItem[]>([]);
const canConfirmReceipt = computed(() => selectedRows.value.length > 0
  && selectedRows.value.every(row => row.orderStatus === 1 && row.payStatus === 0));
const canConfirmPayback = computed(() => selectedRows.value.length > 0
  && selectedRows.value.every(row => row.orderStatus === 1 && row.payStatus === 1));
const canCancel = computed(() => selectedRows.value.length > 0
  && selectedRows.value.every(row => row.orderStatus === 1 && (row.payStatus === 0 || row.payStatus === 1)));

watch(() => tableProps.value.data, () => {
  selectedRows.value = [];
  orderTableRef.value?.clearSelection();
});

const userOptions = ref<UserOption[]>([]);
const transferVisible = ref(false);
const transferLoading = ref(false);
const transferForm = reactive({
  orderId: 0,
  newBuyerId: undefined as number | undefined,
});

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '操作失败，请稍后重试';
}

async function confirmInsufficientPoints(users: InsufficientPointsUser[], message: string) {
  const insufficientUsers = users.filter(user => user.pointsInsufficient);

  try {
    await ElMessageBox.confirm(
      <div class="text-14 leading-24">
        <p>{message}</p>
        {insufficientUsers.length > 0 && (
          <el-descriptions class="mt-12" column={1} size="small" border>
            <el-descriptions-item label="积分不足用户">
              {insufficientUsers.map(user => (
                <div key={user.userId} class="not-last:mb-4">
                  {user.nickname}
                  {' · '}
                  {user.phone}
                  {' · '}
                  {user.identityName}
                </div>
              ))}
            </el-descriptions-item>
          </el-descriptions>
        )}
      </div>,
      '积分不足确认',
      {
        confirmButtonText: '仍然继续',
        cancelButtonText: '取消',
        type: '',
        draggable: true,
      },
    );
    return true;
  }
  catch {
    return false;
  }
}

async function executeOrderOperation(
  operation: (confirmInsufficient: boolean) => AppAxios.ApiPromise<RobOrderOperationData | null>,
  onInsufficientPoints?: () => void,
) {
  try {
    let result = await operation(false);
    const users = result.data?.users;
    if (users !== undefined) {
      onInsufficientPoints?.();
      if (!await confirmInsufficientPoints(users, result.msg))
        return false;

      result = await operation(true);
    }

    ElMessage.success(result.msg);
    return true;
  }
  catch (error) {
    ElMessage.error(getErrorMessage(error));
    return false;
  }
}

function isOrderSelectable(row: RobOrderItem) {
  return row.orderStatus === 1 && (row.payStatus === 0 || row.payStatus === 1);
}

function getOrderRowClassName({ row }: { row: RobOrderItem }) {
  return isOrderSelectable(row) ? 'cursor-pointer' : '';
}

function handleSelectionChange(rows: RobOrderItem[]) {
  selectedRows.value = rows;
}

function handleOrderRowClick(row: RobOrderItem, _column: unknown, event: MouseEvent) {
  if (!isOrderSelectable(row))
    return;

  const target = event.target;
  if (target instanceof Element && target.closest('.app-table-operation-column, .el-checkbox, .el-image, button, a, input, label, select, textarea, [role="button"]'))
    return;

  orderTableRef.value?.toggleRowSelection(row);
}

async function confirmBatchInsufficientPoints(
  orders: RobOrderBatchInsufficient[],
  rows: RobOrderItem[],
  message: string,
) {
  const orderNumbers = new Map(rows.map(row => [row.id, row.orderNo]));

  try {
    await ElMessageBox.confirm(
      <div class="text-14 leading-24">
        <p>{message}</p>
        <div class="mt-12 max-h-240 overflow-y-auto">
          {orders.map(order => (
            <div key={order.orderId} class="mb-8">
              <div class="break-all font-600">
                订单
                {orderNumbers.get(order.orderId) ?? order.orderId}
              </div>
              {order.pointsInsufficient.users?.filter(user => user.pointsInsufficient).map(user => (
                <div key={user.userId}>
                  {user.nickname}
                  {' · '}
                  {user.phone}
                  {' · '}
                  {user.identityName}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>,
      '积分不足确认',
      {
        confirmButtonText: '仍然继续',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
      },
    );
    return true;
  }
  catch {
    return false;
  }
}

async function handleCancel(rows: RobOrderItem[]) {
  const orderIds = rows.map(row => row.id);
  if (!orderIds.length)
    return;

  try {
    await ElMessageBox.confirm(`是否取消选中的 ${orderIds.length} 笔订单？`, '操作提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    });
  }
  catch {
    return;
  }

  try {
    let result = await cancelRobOrder({ orderIds });
    if (result.data !== null) {
      if (!await confirmBatchInsufficientPoints(result.data, rows, result.msg))
        return;
      result = await cancelRobOrder({ orderIds, confirmInsufficient: true });
    }
    ElMessage.success(result.msg);
    await getTableData();
  }
  catch (error) {
    ElMessage.error(getErrorMessage(error));
  }
}

async function handleConfirmPay(orderIds: number[], action: 1 | 2) {
  if (!orderIds.length)
    return;

  const actionName = action === 1 ? '确认收款' : '确认回款';
  try {
    await ElMessageBox.confirm(`是否对选中的 ${orderIds.length} 笔订单${actionName}？`, '操作提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    });
  }
  catch {
    return;
  }

  try {
    const result = await confirmRobOrderPay({ orderIds, action });
    ElMessage.success(result.msg);
    await getTableData();
  }
  catch {
    // 请求层已经显示错误提示
  }
}

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
  const newBuyerId = transferForm.newBuyerId;
  if (!newBuyerId) {
    ElMessage.warning('请选择转移后的用户');
    return;
  }

  transferLoading.value = true;
  try {
    const completed = await executeOrderOperation(confirmInsufficient => transferRobOrder({
      orderId: transferForm.orderId,
      newBuyerId,
      confirmInsufficient,
    }), () => {
      transferVisible.value = false;
    });

    if (completed) {
      transferVisible.value = false;
      await getTableData();
    }
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
        <app-form-item label="收款/回款状态">
          <el-select v-model="params.payStatus" clearable placeholder="请选择状态">
            <el-option label="未收款" :value="0" />
            <el-option label="已收款" :value="1" />
            <el-option label="已回款" :value="2" />
            <el-option label="无效" :value="3" />
          </el-select>
        </app-form-item>
      </app-form>
    </app-card>
    <app-table
      ref="orderTableRef" v-bind="tableProps" :data="tableProps.data" card
      :row-class-name="getOrderRowClassName"
      @refresh="getTableData" @selection-change="handleSelectionChange" @row-click="handleOrderRowClick"
    >
      <template #button>
        <span v-if="selectedRows.length" class="text-14 text-[var(--el-text-color-secondary)]">
          已选 {{ selectedRows.length }} 笔
        </span>
        <el-button
          v-auth="'system:allOrder:confirmReceive'" type="primary" plain :disabled="!canConfirmReceipt"
          @click="handleConfirmPay(selectedRows.map(row => row.id), 1)"
        >
          批量确认收款
        </el-button>
        <el-button
          v-auth="'system:allOrder:confirmPayback'" type="primary" plain :disabled="!canConfirmPayback"
          @click="handleConfirmPay(selectedRows.map(row => row.id), 2)"
        >
          批量确认回款
        </el-button>
        <el-button
          v-auth="'system:allOrder:cancel'" type="primary" plain :disabled="!canCancel"
          @click="handleCancel([...selectedRows])"
        >
          批量取消订单
        </el-button>
      </template>
    </app-table>

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
