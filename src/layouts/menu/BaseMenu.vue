<script setup lang="ts">
import MenuTree from '@/layouts/menu/MenuTree.vue';
import { useRouteStore } from '@/stores/route';

defineOptions({ name: 'BaseMenu' });

withDefaults(defineProps<{
  mode?: 'vertical' | 'horizontal';
  collapse?: boolean;
  uniqueOpened?: boolean;
  ellipsis?: boolean;
}>(), {
  mode: 'vertical',
  collapse: false,
  uniqueOpened: false,
  ellipsis: true,
});

const route = useRoute();
const routeStore = useRouteStore();
const { menus } = storeToRefs(routeStore);

const defaultActive = computed<string>(() =>
  route.meta?.activeMenu ? route.meta.activeMenu : route.path,
);
</script>

<template>
  <el-menu
    :mode="mode"
    :collapse="collapse"
    :default-active="defaultActive"
    :collapse-transition="false"
    :unique-opened="uniqueOpened"
    :ellipsis="mode === 'horizontal' ? ellipsis : undefined"
  >
    <MenuTree v-for="menu of menus" :key="menu.path" :menu="menu" />
  </el-menu>
</template>
