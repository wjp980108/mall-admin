<script lang="ts" setup>
import type { DefaultSettings } from '@/config/settings.ts';
import type { LayoutTemplate } from '@/layouts/template';
import { localeList } from '@/constants/locale.ts';
import ColorSettings from '@/layouts/settings/Color.vue';
import { layoutTemplates } from '@/layouts/template';
import { useAppStore } from '@/stores/app';
import { downloadFile } from '@/utils/download';

defineOptions({ name: 'LayoutSettings' });

const { t } = useI18n();

const appStore = useAppStore();
const activeTab = ref('appearance');

const {
  size,
  asideInverted,
  breadcrumbShow,
  breadcrumbIconShow,
  transitionAnimation,
  tabStyle,
  watermark,
  locale,
  footer,
  layout,
  themeColor,
  colorMode,
  settingPanelShow,
} = storeToRefs(appStore);

const colorModeProxy = computed({
  get: () => colorMode.value,
  set: mode => appStore.setColorMode(mode),
});

const colorModeOptions = [
  { label: 'light', value: 'light', icon: 'icon-park-outline:sun-one' },
  { label: 'dark', value: 'dark', icon: 'icon-park-outline:moon' },
  { label: 'auto', value: 'auto', icon: 'icon-park-outline:laptop-computer' },
];

const settingTabOptions = computed(() => [
  { label: t('systemSettings.tabs.appearance'), value: 'appearance' },
  { label: t('systemSettings.tabs.layout'), value: 'layout' },
  { label: t('systemSettings.tabs.general'), value: 'general' },
]);
const sizeOptions = ['default', 'large', 'small'];
const templateOptions = computed(() => Object.entries(layoutTemplates).map(([value, template]) => ({
  value: value as LayoutTemplate,
  label: t(template.labelKey),
})));

const activeTemplate = computed(() => layoutTemplates[layout.value]);

// 下载当前配置为 defaultSettings.json
function handleDownload() {
  const config: DefaultSettings = {
    colorMode: colorMode.value,
    locale: locale.value,
    layout: layout.value,
    size: size.value,
    transitionAnimation: transitionAnimation.value,
    themeColor: themeColor.value,
    asideInverted: asideInverted.value,
    breadcrumbShow: breadcrumbShow.value,
    breadcrumbIconShow: breadcrumbIconShow.value,
    tabStyle: tabStyle.value,
    watermark: watermark.value,
    footer: footer.value,
  };

  const blob = new Blob([`${JSON.stringify(config, null, 2)}\n`], { type: 'application/json' });
  downloadFile(blob, 'defaultSettings.json');

  ElMessage.success(t('systemSettings.downloadSuccess'));
}

function handleReset() {
  ElMessageBox.confirm(t('systemSettings.isReset'), t('common.kindTips'), {
    confirmButtonText: t('common.sure'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
    draggable: true,
  }).then(() => {
    appStore.handleAppReset();
  });
}
</script>

<template>
  <app-drawer v-model="settingPanelShow" :title="t('systemSettings.title')" size="350" close-on-click-modal>
    <el-segmented v-model="activeTab" :options="settingTabOptions" block />
    <div v-if="activeTab === 'appearance'">
      <el-divider>{{ t('systemSettings.themeMode.title') }}</el-divider>
      <app-flex vertical>
        <el-segmented v-model="colorModeProxy" :options="colorModeOptions" block>
          <template #default="{ item }">
            <app-flex justify="center">
              <app-icon :icon="(item as any).icon" />
            </app-flex>
          </template>
        </el-segmented>
        <app-flex v-if="activeTemplate.supportsAsideInverted" align="center">
          <app-flex :size="0" align="center">
            {{ t('systemSettings.themeMode.sidebar') }}
            <app-help-info :content="t('systemSettings.themeMode.sidebarHelpInfo')" />
          </app-flex>
          <el-switch v-model="asideInverted" />
        </app-flex>
      </app-flex>
      <el-divider>{{ t('systemSettings.themeColor.title') }}</el-divider>
      <ColorSettings />
    </div>

    <div v-else-if="activeTab === 'layout'">
      <el-divider>{{ t('systemSettings.layout.title') }}</el-divider>
      <el-segmented v-model="size" :options="sizeOptions" block>
        <template #default="{ item }">
          {{ t(`systemSettings.layout.${item}`) }}
        </template>
      </el-segmented>
      <el-divider>{{ t('systemSettings.pageConfig.layout') }}</el-divider>
      <div
        :aria-label="t('systemSettings.pageConfig.layout')" class="layout-template-options"
        role="group"
      >
        <button
          v-for="option in templateOptions"
          :key="option.value"
          :aria-pressed="layout === option.value"
          :class="{ 'is-active': layout === option.value }"
          class="layout-template-option"
          type="button"
          @click="layout = option.value"
        >
          <span :class="`is-${option.value}`" aria-hidden="true" class="layout-template-preview">
            <span class="layout-template-preview__topbar" />
            <span v-if="option.value === 'aside'" class="layout-template-preview__sidebar" />
            <span class="layout-template-preview__content" />
          </span>
          <span class="layout-template-option__label">{{ option.label }}</span>
        </button>
      </div>
    </div>

    <div v-else>
      <el-divider>{{ t('systemSettings.tabs.general') }}</el-divider>
      <app-flex vertical>
        <app-flex justify="space-between" align="center">
          {{ t('systemSettings.pageConfig.locale') }}
          <el-select v-model="locale" class="!w-155">
            <el-option v-for="item of localeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </app-flex>
        <app-flex align="center" justify="space-between">
          {{ t('systemSettings.pageConfig.pageSwitching') }}
          <el-select v-model="transitionAnimation" class="!w-155">
            <el-option :label="t('systemSettings.pageConfig.effect.fade')" value="fade" />
            <el-option :label="t('systemSettings.pageConfig.effect.fade-slide')" value="fade-slide" />
            <el-option :label="t('systemSettings.pageConfig.effect.fade-bottom')" value="fade-bottom" />
            <el-option :label="t('systemSettings.pageConfig.effect.fade-scale')" value="fade-scale" />
            <el-option :label="t('systemSettings.pageConfig.effect.zoom-fade')" value="zoom-fade" />
            <el-option :label="t('systemSettings.pageConfig.effect.zoom-out')" value="zoom-out" />
            <el-option :label="t('systemSettings.pageConfig.effect.no')" value="none" />
          </el-select>
        </app-flex>
        <app-flex justify="space-between" align="center">
          {{ t('systemSettings.breadcrumbs.title') }}
          <el-switch v-model="breadcrumbShow" />
        </app-flex>
        <app-flex justify="space-between" align="center">
          {{ t('systemSettings.breadcrumbs.icon') }}
          <el-switch v-model="breadcrumbIconShow" />
        </app-flex>
        <app-flex justify="space-between" align="center">
          {{ t('systemSettings.tabStyle.title') }}
          <el-select v-model="tabStyle" class="!w-155">
            <el-option :label="t('systemSettings.tabStyle.dynamic')" value="dynamic" />
            <el-option :label="t('systemSettings.tabStyle.card')" value="card" />
            <el-option :label="t('systemSettings.tabStyle.simple')" value="simple" />
          </el-select>
        </app-flex>
        <app-flex justify="space-between" align="center">
          {{ t('systemSettings.watermark') }}
          <el-switch v-model="watermark" />
        </app-flex>
        <app-flex justify="space-between" align="center">
          {{ t('systemSettings.footer') }}
          <el-switch v-model="footer" />
        </app-flex>
      </app-flex>
    </div>

    <template #footer>
      <el-button type="primary" @click="handleDownload">
        {{ t('systemSettings.download') }}
        <app-help-info color="white">
          {{ t('systemSettings.downloadTip') }}
        </app-help-info>
      </el-button>
      <el-button type="danger" @click="handleReset">
        {{ t('common.reset') }}
      </el-button>
    </template>
  </app-drawer>
</template>

<style scoped lang="scss">
.layout-template-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-base);
}

.layout-template-option {
  display: grid;
  gap: var(--spacing-sm);
  min-width: 0;
  padding: 0;
  color: inherit;
  font: inherit;
  text-align: center;
  background: transparent;
  border: 0;
  cursor: pointer;

  &:hover .layout-template-preview,
  &.is-active .layout-template-preview {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 1px var(--el-color-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--el-color-primary);
    outline-offset: 3px;
    border-radius: var(--el-border-radius-base);
  }
}

.layout-template-preview {
  position: relative;
  display: block;
  height: calc(var(--spacing-xxl) + var(--spacing-xl) + var(--spacing-sm));
  overflow: hidden;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-lighter);
  transition:
    border-color var(--el-transition-duration),
    box-shadow var(--el-transition-duration);
}

.layout-template-preview__topbar,
.layout-template-preview__sidebar,
.layout-template-preview__content {
  position: absolute;
  display: block;
  border-radius: var(--el-border-radius-small);
}

.layout-template-preview__topbar,
.layout-template-preview__sidebar {
  background: var(--el-color-primary);
}

.layout-template-preview__content {
  background: var(--el-color-primary-light-8);
}

.layout-template-preview.is-aside .layout-template-preview__sidebar {
  inset: var(--spacing-sm) auto var(--spacing-sm) var(--spacing-sm);
  width: var(--spacing-lg);
}

.layout-template-preview.is-aside .layout-template-preview__topbar {
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  left: calc(var(--spacing-xl) + var(--spacing-sm));
  height: var(--spacing-base);
}

.layout-template-preview.is-aside .layout-template-preview__content {
  top: var(--spacing-xl);
  right: var(--spacing-sm);
  bottom: var(--spacing-sm);
  left: calc(var(--spacing-xl) + var(--spacing-sm));
}

.layout-template-preview.is-top .layout-template-preview__topbar {
  inset: var(--spacing-sm) var(--spacing-sm) auto;
  height: 20px;
}

.layout-template-preview.is-top .layout-template-preview__content {
  inset: calc(var(--spacing-xl) + var(--spacing-xs)) var(--spacing-sm) var(--spacing-sm);
}

.layout-template-option__label {
  overflow: hidden;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
