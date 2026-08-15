<script setup lang="ts">
import type { MenuItemRegistered } from 'element-plus';
import type { RouteRecordRaw } from 'vue-router';
import { navigationFailure } from '@/constants/router';
import { useNotification } from '@/hooks/useNotification';

defineOptions({ name: 'LayoutMenuTree' });
defineProps<{
  menu: RouteRecordRaw;
}>();

const router = useRouter();
const route = useRoute();

const { notify } = useNotification();

// 点击菜单切换路由
function handleClickMenu(item: MenuItemRegistered) {
  if (item.index === route.fullPath)
    return notify(navigationFailure());

  if (item.index) {
    router.push(item.index);
  }
}
</script>

<template>
  <el-sub-menu v-if="menu.children?.length" :index="menu.path">
    <template #title>
      <app-icon v-if="menu.meta?.icon" :icon="menu.meta.icon" />
      <app-text class="color-unset">
        {{ menu.meta!.title }}
      </app-text>
    </template>
    <MenuTree v-for="child of menu.children" :key="child.path" :menu="child" />
  </el-sub-menu>
  <el-menu-item v-else :index="menu.path" @click="handleClickMenu">
    <app-icon v-if="menu.meta?.icon" :icon="menu.meta.icon" />
    <template #title>
      <app-text class="color-unset">
        {{ menu.meta!.title }}
      </app-text>
    </template>
  </el-menu-item>
</template>

<style scoped lang="scss">
:deep(.el-text) {
  --el-text-font-size: var(--el-font-size-medium);
}
</style>
