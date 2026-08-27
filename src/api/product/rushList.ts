import type { RushTimeSettingItem } from '@/api/rushSystem/timeSetting.ts';
import request from '@/utils/axios';

export interface RushProductItem {
  id: number;
  goodsName: string;
  goodsPrice: number;
  memberId: string;
  sessionId: string;
  coverImg: string;
  coverImgPlatform: string;
  detailImg: string;
  detailImgPlatform: string;
  goodsDetail: string;
  onlineStatus: boolean;
  createTime?: string;
}

export interface RushProductListParams {
  goodsName: string;
  consignorPhone: string;
  onlineStatus?: boolean;
}

export type RushProductCreateForm = Omit<RushProductItem, 'id' | 'createTime'>;
export type RushProductUpdateForm = Omit<RushProductItem, 'createTime'>;

export interface RushProductListStatus {
  id: number;
  onlineStatus: boolean;
}

// 获取抢购商品列表
export function fetchRushProductList(params: RushProductListParams) {
  return request<RushProductItem[]>({
    url: '/api/consign-goods',
    params,
  });
}

// 获取委托人列表
export function fetchUserList() {
  return request<User.Item[]>({
    url: '/api/users/options',
  });
}

// 获取所属场次列表
export function fetchSessionList() {
  return request<RushTimeSettingItem[]>({
    url: '/api/sessions/options',
  });
}

// 新增抢购商品
export function createRushProduct(data: RushProductCreateForm) {
  return request({
    url: '/api/consign-goods',
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 编辑抢购商品
export function updateRushProduct(data: RushProductUpdateForm) {
  return request({
    url: '/api/consign-goods',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除抢购商品
export function deleteRushProduct(id: number) {
  return request({
    url: `/api/consign-goods/${id}`,
    method: 'delete',
  }, {
    loading: true,
  });
}

// 更新抢购商品状态
export function updateRushProductStatus(data: RushProductListStatus) {
  return request({
    url: '/api/consign-goods/status',
    method: 'patch',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}
