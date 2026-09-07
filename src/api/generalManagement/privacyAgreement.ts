import request from '@/utils/axios';

export interface PrivacyAgreement {
  title: string;
  content: string;
}

// 获取隐私协议
export function fetchPrivacyAgreement() {
  return request<PrivacyAgreement>({
    url: '/api/agreement',
    params: { type: 2 },
  });
}

// 保存隐私协议
export function updatePrivacyAgreement(data: PrivacyAgreement) {
  return request({
    url: '/api/agreement',
    method: 'put',
    data: {
      type: 2,
      ...data,
    },
  }, {
    loading: true,
    successMessage: true,
  });
}
