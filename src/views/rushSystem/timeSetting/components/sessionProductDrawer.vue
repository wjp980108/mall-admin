<script setup lang="tsx">
import type { SessionProductItem } from '@/api/rushSystem/sessionProduct';
import type { RushTimeSettingItem } from '@/api/rushSystem/timeSetting';
import type { TableColumns } from '@/components';
import {
  deleteSessionProduct,
  fetchSessionProductBySessionId,
  updateSessionProduct,
} from '@/api/rushSystem/sessionProduct';
import { renderIcon } from '@/components';
import { useConfirm } from '@/hooks/useConfirm';
import SessionProductSelector from './sessionProductSelector.vue';

defineOptions({ name: 'SessionProductDrawer' });

const visible = ref(false);
const selectProductVisible = ref(false);
const loading = ref(false);
const currentSession = ref<RushTimeSettingItem>();
const sessionProducts = ref<SessionProductItem[]>([]);

const title = computed(() => {
  return currentSession.value ? `关联商品 · ${currentSession.value.sessionName}` : '关联商品';
});

const linkedGoodsIds = computed(() => new Set(sessionProducts.value.map(item => item.goodsId)));
const nextSort = computed(() => Math.max(0, ...sessionProducts.value.map(item => item.sort)) + 1);

const sessionProductColumns = computed<TableColumns<SessionProductItem>>(() => [
  { type: 'index', fixed: 'left' },
  {
    label: '商品',
    minWidth: 240,
    renderContent: ({ row }) => (
      <div class="flex items-center gap-8">
        {row.goodsThumb && (
          <ElImage class="h-40 w-40 shrink-0 rounded-4" src={row.goodsThumb} fit="cover" />
        )}
        <div class="min-w-0">
          <div class="truncate">{row.goodsName}</div>
          {row.goodsSn && (
            <div class="mt-4 text-12 text-[var(--el-text-color-secondary)]">
              货号：
              {row.goodsSn}
            </div>
          )}
        </div>
      </div>
    ),
  },
  { type: 'money', prop: 'price', label: '商品售价', width: 120 },
  {
    label: '场次库存',
    width: 180,
    align: 'center',
    renderContent: ({ row }) => (
      <ElInputNumber v-model={row.stock} min={0} precision={0} controls-position="right" />
    ),
  },
  {
    label: '场次内排序',
    width: 180,
    align: 'center',
    renderContent: ({ row }) => (
      <ElInputNumber v-model={row.sort} min={0} precision={0} controls-position="right" />
    ),
  },
  {
    label: '操作',
    type: 'operation',
    fixed: 'right',
    width: 120,
    align: 'center',
    buttons: [
      {
        label: '保存',
        onClick: ({ row }) => handleUpdate(row),
      },
      {
        label: '解除关联',
        type: 'danger',
        onClick: ({ row }) => handleDelete(row),
      },
    ],
  },
]);

function open(session: RushTimeSettingItem) {
  currentSession.value = session;
  visible.value = true;
  getSessionProducts();
}

async function getSessionProducts() {
  if (!currentSession.value)
    return;

  loading.value = true;
  try {
    const { data } = await fetchSessionProductBySessionId(currentSession.value.id);
    sessionProducts.value = data;
  }
  finally {
    loading.value = false;
  }
}

function openProductSelector() {
  selectProductVisible.value = true;
}

async function handleUpdate(row: Pick<SessionProductItem, 'id' | 'sessionId' | 'goodsId' | 'stock' | 'sort'>) {
  await updateSessionProduct({
    id: row.id,
    sessionId: row.sessionId,
    goodsId: row.goodsId,
    stock: row.stock,
    sort: row.sort,
  });
  await getSessionProducts();
}

async function handleDelete(row: Pick<SessionProductItem, 'id' | 'goodsName'>) {
  await useConfirm(deleteSessionProduct, row.id, `解除“${row.goodsName}”的场次关联`);
  await getSessionProducts();
}

defineExpose({ open });
</script>

<template>
  <app-drawer v-model="visible" :title size="950" resizable :show-footer="false">
    <app-flex class="h-[calc(100vh-56.8px-32px)]" vertical>
      <app-flex justify="space-between" align="center">
        <div class="text-14 text-[var(--el-text-color-secondary)]">
          关联后可单独维护该场次内商品的抢购库存和展示顺序。
        </div>
        <el-button type="primary" :icon="renderIcon('CirclePlus')" @click="openProductSelector">
          关联商品
        </el-button>
      </app-flex>
      <app-base-table v-loading="loading" :data="sessionProducts" :columns="sessionProductColumns" />
    </app-flex>
  </app-drawer>
  <SessionProductSelector
    v-model="selectProductVisible" :session-id="currentSession?.id" :linked-goods-ids="[...linkedGoodsIds]"
    :start-sort="nextSort" @confirm="getSessionProducts"
  />
</template>
