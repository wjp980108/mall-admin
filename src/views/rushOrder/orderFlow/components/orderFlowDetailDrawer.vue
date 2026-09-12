<script setup lang="ts">
import type { RobOrderFlowDetail, RobOrderFlowItem } from '@/api/rushOrder/orderFlow';
import { fetchRobOrderFlowDetail } from '@/api/rushOrder/orderFlow';

defineOptions({ name: 'OrderFlowDetailDrawer' });

const visible = ref(false);
const loading = ref(false);
const orderDetail = ref<RobOrderFlowDetail>();

async function open(row: Pick<RobOrderFlowItem, 'orderId'>) {
  visible.value = true;
  loading.value = true;
  orderDetail.value = undefined;

  try {
    const { data } = await fetchRobOrderFlowDetail(row.orderId);
    orderDetail.value = data;
  }
  finally {
    loading.value = false;
  }
}

defineExpose({ open });
</script>

<template>
  <app-drawer v-model="visible" title="订单流水详情" size="700" resizable :show-footer="false">
    <div v-loading="loading" class="min-h-300 p-16">
      <app-flex v-if="orderDetail" vertical :size="24">
        <app-flex :size="12" align="center">
          <el-image class="h-64 w-64 shrink-0 rounded-4" :src="orderDetail.goodsThumb" fit="cover" />
          <app-flex class="min-w-0" vertical :size="4">
            <div class="truncate text-16 font-600">
              {{ orderDetail.goodsName }}
            </div>
            <div class="text-12 text-[var(--el-text-color-secondary)]">
              {{ orderDetail.goodsSn }} × {{ orderDetail.quantity }}
            </div>
          </app-flex>
        </app-flex>

        <el-descriptions title="订单信息" :column="1" border>
          <el-descriptions-item label="订单号">
            {{ orderDetail.orderNo }}
          </el-descriptions-item>
          <el-descriptions-item label="购买用户">
            #{{ orderDetail.buyerId }} · {{ orderDetail.buyerName }} · {{ orderDetail.buyerPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">
            ¥{{ orderDetail.totalAmount }}
          </el-descriptions-item>
          <el-descriptions-item label="场次">
            {{ orderDetail.sessionName }}（{{ orderDetail.rushStartTime }} ~ {{ orderDetail.rushEndTime }}）
          </el-descriptions-item>
          <el-descriptions-item label="收货信息">
            {{ orderDetail.receiverName }} · {{ orderDetail.receiverPhone }} · {{ orderDetail.receiveAddress }}
          </el-descriptions-item>
        </el-descriptions>

        <app-flex vertical :size="16">
          <div class="text-16 font-600">
            订单流水
          </div>
          <el-timeline class="pl-8">
            <el-timeline-item
              v-for="event in orderDetail.events" :key="event.logId" :timestamp="event.eventTime"
              placement="top"
            >
              <app-flex vertical :size="4">
                <div class="font-600">
                  {{ event.eventTypeName }}
                </div>
                <div class="text-12 text-[var(--el-text-color-secondary)]">
                  操作人：#{{ event.operatorId }} · {{ event.operatorName }}
                </div>
                <div class="text-12 text-[var(--el-text-color-secondary)]">
                  状态变化：{{ event.beforeStatusName }} → {{ event.afterStatusName }}
                </div>
                <div v-if="event.remark" class="text-12 text-[var(--el-text-color-secondary)]">
                  备注：{{ event.remark }}
                </div>
              </app-flex>
            </el-timeline-item>
          </el-timeline>
        </app-flex>
      </app-flex>
    </div>
  </app-drawer>
</template>
