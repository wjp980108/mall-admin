<script setup lang="ts">
import dayjs from 'dayjs';
import { useAppStore } from '@/stores/app';

defineOptions({ name: 'LayoutFooter' });

const appStore = useAppStore();
const { siteName } = storeToRefs(appStore);
</script>

<template>
  <el-footer>
    Copyright © 2024-{{ dayjs().format('YYYY') }}
    <el-link href="https://github.com/wjp980108/meet-admin" target="_blank" underline="never">
      &nbsp;{{ siteName }}
    </el-link>
  </el-footer>
</template>

<style scoped lang="scss">
.el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  --el-footer-height: 35px;
}
</style>
