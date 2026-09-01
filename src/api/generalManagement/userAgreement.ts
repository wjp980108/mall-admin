import request from '@/utils/axios';

export interface UserAgreement {
  title: string;
  content: string;
}

// 获取用户协议
export function fetchUserAgreement() {
  return request<UserAgreement>({
    url: '/api/agreement',
  });
}

// 保存用户协议
export function updateUserAgreement(data: UserAgreement) {
  return request({
    url: '/api/agreement',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}
