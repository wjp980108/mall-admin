import type { Platform } from '@/constants/common.ts';
import request from '@/utils/axios';

export interface ProfileUpdateForm {
  avatar: string;
  avatarPlatform?: Platform;
  email?: string;
  gender?: 0 | 1 | 2;
  nickname?: string;
  phone?: string;
}

// 更新当前登录用户的资料
export function updateProfile(data: ProfileUpdateForm) {
  return request({
    url: '/api/users/profile',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 修改当前登录用户密码
export function changePassword(password: string) {
  return request({
    url: '/api/users/password',
    method: 'put',
    data: {
      password,
    },
  }, {
    loading: true,
    successMessage: true,
  });
}
