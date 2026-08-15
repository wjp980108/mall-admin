<script setup lang="ts">
import Avatar from '@/layouts/header/Avatar.vue';
import Locale from '@/layouts/header/Locale.vue';
import Notification from '@/layouts/header/Notification.vue';
import ThemeSwitch from '@/layouts/header/ThemeSwitch.vue';
import SearchMenu from '@/layouts/menu/MenuSearch.vue';
import { useAppStore } from '@/stores/app';

defineOptions({ name: 'LayoutHeaderActions' });
defineProps<{ compact: boolean }>();

const appStore = useAppStore();
const { fullscreen, settingPanelShow } = storeToRefs(appStore);
const showSearchMenu = ref(false);
</script>

<template>
  <app-flex class="shrink-0" :size="8" align="center">
    <template v-if="!compact">
      <div class="wrapper" @click="showSearchMenu = true">
        <app-icon icon="icon-park-outline:search" />
      </div>
      <div class="wrapper" @click="appStore.toggleFullScreen">
        <app-icon v-if="fullscreen" icon="icon-park-outline:off-screen-one" />
        <app-icon v-else icon="icon-park-outline:full-screen-one" />
      </div>
      <Notification />
      <ThemeSwitch />
      <Locale />
      <div class="wrapper" @click="settingPanelShow = true">
        <app-icon icon="icon-park-outline:setting" />
      </div>
    </template>
    <Avatar />
    <!-- 搜索菜单 -->
    <SearchMenu v-model="showSearchMenu" />
  </app-flex>
</template>
