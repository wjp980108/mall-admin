<script setup lang="ts">
import logo from '@/assets/images/logo.png';
import HeaderActions from '@/layouts/header/Actions.vue';
import BaseMenu from '@/layouts/menu/BaseMenu.vue';
import Content from '@/layouts/shared/Content.vue';
import Tabs from '@/layouts/shared/Tabs.vue';

defineOptions({ name: 'TopbarLayout' });

const router = useRouter();
const name = import.meta.env.VITE_APP_NAME;
const homePage = import.meta.env.VITE_HOME_PATH;

const headerRef = useTemplateRef<HTMLElement>('headerRef');
const { width } = useElementSize(headerRef, { width: window.innerWidth, height: 0 });
const isCompact = computed(() => width.value <= 405);
</script>

<template>
  <el-container direction="vertical">
    <el-header>
      <div ref="headerRef" class="topbar p-[8px_12px] border-b">
        <div class="top-logo flex-center shrink-0 cursor-pointer" @click="router.push(homePage)">
          <el-image class="w-36" :src="logo" alt="Logo" />
          <span class="ml-[var(--spacing-sm)] whitespace-nowrap text-20px font-bold">{{ name }}</span>
        </div>
        <BaseMenu class="top-menu" mode="horizontal" />
        <HeaderActions :compact="isCompact" />
      </div>
      <!-- 页签 -->
      <Tabs />
    </el-header>
    <Content />
  </el-container>
</template>

<style scoped lang="scss">
.topbar {
  display: flex;
  align-items: center;

  .top-logo {
    height: 38px;
    margin-right: var(--spacing-base);
  }

  .top-menu {
    flex: 1;
    min-width: 0;
    border-bottom: 0;
    --el-menu-horizontal-height: 38px;
    --el-menu-item-height: 38px;
    //--el-menu-hover-bg-color: transparent;

    :deep(.el-sub-menu__title),
    :deep(.el-menu-item) {
      padding: 0 var(--spacing-base);
    }
  }
}
</style>
