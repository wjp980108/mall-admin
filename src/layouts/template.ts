import type { Component } from 'vue';
import SidebarLayout from './templates/SidebarLayout.vue';
import TopbarLayout from './templates/TopbarLayout.vue';

export interface LayoutTemplateDefinition {
  component: Component;
  labelKey: string;
  supportsAsideInverted?: boolean;
}

export const layoutTemplates = {
  aside: {
    component: SidebarLayout,
    labelKey: 'systemSettings.pageConfig.layoutOptions.aside',
    supportsAsideInverted: true,
  },
  top: {
    component: TopbarLayout,
    labelKey: 'systemSettings.pageConfig.layoutOptions.top',
    supportsAsideInverted: false,
  },
} satisfies Record<string, LayoutTemplateDefinition>;

export type LayoutTemplate = keyof typeof layoutTemplates;
