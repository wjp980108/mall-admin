import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/profile',
  name: 'Profile',
  component: () => import('@/views/profile/index.vue'),
  meta: {
    title: '个人中心',
    icon: 'icon-park-outline:user',
    hideInMenu: true,
  },
} satisfies RouteRecordRaw;
