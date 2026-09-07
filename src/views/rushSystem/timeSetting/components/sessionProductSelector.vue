<script setup lang="tsx">
import type { TableInstance } from 'element-plus';
import type {
  SessionProductCandidateItem,
} from '@/api/rushSystem/sessionProduct';
import type { TableColumns } from '@/components';
import {
  createSessionProducts,
  fetchSessionProductCandidates,
} from '@/api/rushSystem/sessionProduct';

defineOptions({ name: 'SessionProductSelector' });

const props = defineProps<{
  sessionId?: number;
  linkedGoodsIds: number[];
  startSort: number;
}>();

const emit = defineEmits<{
  confirm: [];
}>();

const visible = defineModel<boolean>({ required: true });
const loading = ref(false);
const submitting = ref(false);
const products = ref<SessionProductCandidateItem[]>([]);
const selectedProducts = ref<SessionProductCandidateItem[]>([]);
const batchStock = ref(0);
const batchSort = ref(0);
const productTableRef = useTemplateRef<TableInstance>('productTableRef');
const linkedGoodsIdSet = computed(() => new Set(props.linkedGoodsIds));

const productColumns = computed<TableColumns<SessionProductCandidateItem>>(() => [
  {
    type: 'selection',
    width: 52,
    reserveSelection: true,
    selectable: row => isProductSelectable(row),
  },
  {
    label: '商品',
    minWidth: 260,
    renderContent: ({ row }) => (
      <div class="flex items-center gap-8">
        {row.coverImg && (
          <ElImage class="h-40 w-40 shrink-0 rounded-4" src={row.coverImg} fit="cover" />
        )}
        <span class="truncate">{row.goodsName}</span>
      </div>
    ),
  },
  { type: 'money', prop: 'goodsPrice', label: '售价', width: 120 },
]);

watch(visible, (value) => {
  if (!value)
    return;

  selectedProducts.value = [];
  batchStock.value = 0;
  batchSort.value = props.startSort;
  getProducts();
});

async function getProducts() {
  loading.value = true;
  try {
    const res = await fetchSessionProductCandidates({
      onlineStatus: 1,
      pageNum: 1,
      pageSize: 99999,
    });
    products.value = res.data.list;
  }
  finally {
    loading.value = false;
  }
}

function handleProductSelection(rows: SessionProductCandidateItem[]) {
  const currentPageIds = new Set(products.value.map(item => item.id));
  const selections = new Map(selectedProducts.value.map(item => [item.id, item]));

  currentPageIds.forEach(id => selections.delete(id));
  rows.forEach(row => selections.set(row.id, row));
  selectedProducts.value = [...selections.values()];
}

function isProductSelectable(row: SessionProductCandidateItem) {
  return !linkedGoodsIdSet.value.has(row.id);
}

function handleProductRowClick(row: SessionProductCandidateItem, _column: unknown, event: MouseEvent) {
  if (!isProductSelectable(row))
    return;

  const target = event.target;
  if (target instanceof HTMLElement && target.closest('.el-checkbox'))
    return;

  productTableRef.value?.toggleRowSelection(row);
}

async function handleConfirm() {
  if (!props.sessionId || !selectedProducts.value.length)
    return;

  submitting.value = true;
  try {
    await createSessionProducts({
      sessionId: props.sessionId,
      items: selectedProducts.value.map((product, index) => ({
        goodsId: product.id,
        stock: batchStock.value,
        sort: batchSort.value + index,
      })),
    });
    visible.value = false;
    emit('confirm');
  }
  finally {
    submitting.value = false;
  }
}
</script>

<template>
  <app-popup
    v-model="visible" class="session-product-selector" title="选择关联商品" :loading="submitting"
    confirm-text="确认关联" @confirm="handleConfirm"
  >
    <app-flex class="h-418" vertical>
      <app-flex align="center">
        <span class="text-14 text-[var(--el-text-color-secondary)]">已选 {{
          selectedProducts.length
        }} 件</span>
        <span class="text-14">初始场次库存</span>
        <el-input-number v-model="batchStock" :min="0" :precision="0" controls-position="right" />
        <span class="text-14">起始排序</span>
        <el-input-number v-model="batchSort" :min="0" :precision="0" controls-position="right" />
      </app-flex>

      <app-base-table
        ref="productTableRef" v-loading="loading" :data="products" :columns="productColumns"
        @row-click="handleProductRowClick" @selection-change="handleProductSelection"
      />
    </app-flex>
  </app-popup>
</template>

<style lang="scss">
.session-product-selector {
  .el-table__row {
    cursor: pointer;
  }
}
</style>
