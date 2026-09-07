import request from '@/utils/axios';

export interface SystemSettings {
  id: number;
  siteName: string;
  siteLogo: string;
  newMemberDays: number;
  newMemberAdvanceMinutes: number;
  preViewMinutes: number;
  limitRule: number;
  shareValidDays: number;
  recommendRate: number;
  referrerPurchaseDays: number;
  selfBuyRate: number;
  selfBuyBonusRatio: number;
  couponRatio: number;
  showSelfBuyBonus: number;
  showCoupon: number;
  orderProfitRate: number;
  posterBgImage: string;
  createTime: string;
  updateTime: string;
  isDeleted: number;
}

export interface SystemSettingsUpdateForm {
  id: number;
  siteName: string;
  siteLogo: string;
  newMemberDays: number;
  newMemberAdvanceMinutes: number;
  limitRule: number;
  recommendRate: number;
  selfBuyRate: number;
  selfBuyBonusRatio: number;
  couponRatio: number;
  orderProfitRate: number;
}

// 查询系统设置
export function fetchSystemSettings() {
  return request<SystemSettings>({
    url: '/api/settings',
  }, {
    loading: true,
  });
}

// 更新系统设置
export function updateSystemSettings(data: SystemSettingsUpdateForm) {
  return request({
    url: '/api/settings',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}
