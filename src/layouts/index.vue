<script setup lang="ts">
import dayjs from 'dayjs';
import Settings from '@/layouts/settings/index.vue';
import { layoutTemplates } from '@/layouts/template';
import { initRouter } from '@/router/utils.ts';
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';

defineOptions({ name: 'Layout' });

const appStore = useAppStore();
const userStore = useUserStore();
const { watermark, locale, isDark, layout } = storeToRefs(appStore);

const router = useRouter();
const currentRoute = useRoute();

watch(locale, async () => {
  await initRouter();
  await router.replace(currentRoute.fullPath);
});

const watermarkContent = computed(() => {
  const { nickname } = userStore.userInfo;
  return watermark.value ? `${nickname || import.meta.env.VITE_APP_NAME} ${dayjs().format('YYYY-MM-DD')}` : '';
});

const watermarkFont = computed(() => ({
  fontSize: 14,
  color: isDark.value ? 'rgba(255, 255, 255, .15)' : 'rgba(0, 0, 0, .15)',
}));
</script>

<template>
  <el-watermark class="wh-full" :content="watermarkContent" :font="watermarkFont" :z-index="9999">
    <component :is="layoutTemplates[layout].component" />
    <!-- 系统设置 -->
    <Settings />
  </el-watermark>
</template>
