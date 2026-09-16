<script setup lang="ts">
import type { UserPointsDetail, UserPointsFlow } from '@/api/system/user';
import { fetchUserPoints } from '@/api/system/user';
import { moneyThousand } from '@/utils/money';

defineOptions({ name: 'UserPointsDrawer' });

const visible = ref(false);
const loading = ref(false);
const user = ref<User.Item>();
const pointDetail = ref<UserPointsDetail>();
const bizType = ref<UserPointsFlow['bizType']>();
const pagination = reactive({
  current: 1,
  pageSize: 10,
});

const totalPoints = computed(() => {
  const balance = pointDetail.value?.balance;
  return (balance?.points ?? 0) + (balance?.couponPoints ?? 0);
});

function isIncome(flowType: UserPointsFlow['flowType']) {
  return flowType === 1 || flowType === 4;
}

async function getPointDetails() {
  if (!user.value)
    return;

  loading.value = true;
  try {
    const { data } = await fetchUserPoints(user.value.id, {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      bizType: bizType.value,
    });
    pointDetail.value = data;
  }
  finally {
    loading.value = false;
  }
}

function handleBizTypeChange() {
  pagination.current = 1;
  getPointDetails();
}

async function open(row: User.Item) {
  user.value = row;
  pointDetail.value = undefined;
  bizType.value = undefined;
  pagination.current = 1;
  visible.value = true;
  await getPointDetails();
}

defineExpose({ open });
</script>

<template>
  <app-drawer v-model="visible" class="user-points-drawer" title="积分详情" size="900" resizable :show-footer="false">
    <div v-loading="loading" class="h-full min-h-0 flex flex-col p-16">
      <template v-if="user">
        <div class="mb-16 flex items-center justify-between rounded-8 bg-[var(--el-fill-color-light)] p-16">
          <div class="flex items-center gap-12">
            <el-avatar :size="48" :src="user.avatar">
              {{ user.nickname.slice(0, 1) }}
            </el-avatar>
            <div>
              <div class="text-16 font-600">
                {{ user.nickname }}
                <span class="ml-4 text-13 text-[var(--el-text-color-secondary)]">#{{ user.id }}</span>
              </div>
              <div class="mt-4 text-13 text-[var(--el-text-color-secondary)]">
                {{ user.phone }}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-13 text-[var(--el-text-color-secondary)]">
              账户总积分
            </div>
            <div class="mt-4 text-24 text-[var(--el-color-primary)] font-600">
              {{ moneyThousand(totalPoints) }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 mb-16 gap-12">
          <div class="border-[var(--el-border-color-lighter)] rounded-8 p-16 border">
            <div class="text-13 text-[var(--el-text-color-secondary)]">
              可用积分
            </div>
            <div class="mt-8 text-20 text-[var(--el-color-success)] font-600">
              {{ moneyThousand(pointDetail?.balance.points ?? 0) }}
            </div>
            <div class="mt-4 text-12 text-[var(--el-text-color-secondary)]">
              可用于积分转让
            </div>
          </div>
          <div class="border-[var(--el-border-color-lighter)] rounded-8 p-16 border">
            <div class="text-13 text-[var(--el-text-color-secondary)]">
              购物券积分
            </div>
            <div class="mt-8 text-20 text-[var(--el-color-warning)] font-600">
              {{ moneyThousand(pointDetail?.balance.couponPoints ?? 0) }}
            </div>
            <div class="mt-4 text-12 text-[var(--el-text-color-secondary)]">
              仅限购物使用，不可转让
            </div>
          </div>
        </div>

        <div class="min-h-0 flex flex-1 flex-col">
          <div class="mb-12 flex shrink-0 items-center justify-between gap-12">
            <div class="text-16 font-600">
              积分流水
            </div>
            <el-select v-model="bizType" class="w-160" clearable placeholder="全部业务类型" @change="handleBizTypeChange">
              <el-option label="推荐奖" :value="1" />
              <el-option label="自购奖" :value="2" />
              <el-option label="购物券奖" :value="3" />
              <el-option label="积分对冲" :value="4" />
            </el-select>
          </div>

          <el-empty v-if="!loading && !pointDetail?.list.length" class="flex-1" :image-size="96" description="暂无积分流水" />
          <template v-else>
            <div class="min-h-0 flex-1">
              <el-table :data="pointDetail?.list" height="100%" border>
                <el-table-column label="业务类型" min-width="120">
                  <template #default="{ row }">
                    <div>{{ row.bizTypeName }}</div>
                    <div class="mt-4 text-12 text-[var(--el-text-color-secondary)]">
                      {{ row.accountTypeName }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="变动金额" width="130" align="right">
                  <template #default="{ row }">
                    <div :class="isIncome(row.flowType) ? 'text-[var(--el-color-success)]' : 'text-[var(--el-color-danger)]'" class="font-600">
                      {{ isIncome(row.flowType) ? '+' : '-' }}{{ moneyThousand(row.amount) }}
                    </div>
                    <div class="mt-4 text-12 text-[var(--el-text-color-secondary)]">
                      余额 {{ moneyThousand(row.afterPoints) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="关联信息" min-width="180" show-overflow-tooltip>
                  <template #default="{ row }">
                    <div>{{ row.orderNo || row.remark || '-' }}</div>
                    <div v-if="row.counterpartyName" class="mt-4 text-12 text-[var(--el-text-color-secondary)]">
                      对方：#{{ row.counterpartyUserId }} · {{ row.counterpartyName }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="flowTypeName" label="变动类型" width="110" />
                <el-table-column prop="createTime" label="创建时间" width="170" />
              </el-table>
            </div>
            <div class="mt-16 flex shrink-0 justify-end">
              <el-pagination
                v-model:current-page="pagination.current" :page-size="pagination.pageSize"
                background layout="total, prev, pager, next" :total="pointDetail?.total ?? 0"
                @current-change="getPointDetails"
              />
            </div>
          </template>
        </div>
      </template>
    </div>
  </app-drawer>
</template>

<style lang="scss">
.el-drawer.user-points-drawer {
  display: flex;
  height: 100vh;
  flex-direction: column;

  .el-drawer__header {
    flex-shrink: 0;
  }

  .el-drawer__body {
    height: auto;
    flex: 1;
    display: flex;
    min-height: 0;
    overflow: hidden;

    > .el-scrollbar {
      min-height: 0;
      flex: 1;

      > .el-scrollbar__wrap {
        overflow: hidden;

        > .drawer-scrollbar-view {
          height: 100%;
          min-height: 0;
          padding: 0;
        }
      }
    }
  }
}
</style>
