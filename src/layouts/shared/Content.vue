<script setup lang="ts">
import Footer from '@/layouts/shared/Footer.vue';
import Iframe from '@/layouts/shared/Iframe.vue';
import { useAppStore } from '@/stores/app';
import { useRouteStore } from '@/stores/route';

defineOptions({ name: 'LayoutContent' });

const { t } = useI18n();
const appStore = useAppStore();
const routeStore = useRouteStore();
const { transitionAnimation, loadFlag, footer } = storeToRefs(appStore);
</script>

<template>
  <el-main class="relative bg-[var(--el-bg-color-page)]" style="--el-main-padding: 0">
    <el-scrollbar class="main-scrollbar" view-class="main-scrollbar-view">
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionAnimation" mode="out-in" appear>
          <keep-alive :include="routeStore.keepAliveName">
            <component :is="Component" v-if="loadFlag" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </el-scrollbar>
    <!-- Iframe 容器 -->
    <Iframe />
  </el-main>
  <Footer v-if="footer" />
  <el-tooltip :content="t('common.backToTop')" placement="top">
    <el-backtop target=".main-scrollbar .el-scrollbar__wrap" />
  </el-tooltip>
</template>

<style scoped lang="scss">
.main-scrollbar {
  :deep(.main-scrollbar-view) {
    padding: var(--spacing-base);
    display: flex;
    flex-direction: column;
    min-height: 100%;

    &:has(.main-container) {
      height: 100%;
    }
  }
}
</style>
