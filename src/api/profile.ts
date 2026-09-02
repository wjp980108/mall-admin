import request from '@/utils/axios';

export type ProfileUpdateForm = Pick<User.CurrentUser, 'id' | 'nickname' | 'phone' | 'email' | 'gender' | 'avatar' | 'avatarPlatform'>;

// 更新个人资料；后端提供当前用户专用接口后，仅需调整此处的请求地址和载荷。
export function updateProfile(data: ProfileUpdateForm) {
  return request({
    url: '/api/users',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}
