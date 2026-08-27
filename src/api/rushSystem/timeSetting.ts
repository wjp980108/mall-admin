import request from '@/utils/axios';

export interface RushTimeSettingItem {
  id: number;
  sessionName: string;
  rushStartTime: string;
  rushEndTime: string;
  enterControlMinute: number;
  maxBuyCount: number;
  beforeForbidMinute: number;
  afterForbidMinute: number;
  bgImg: string;
  bgImgPlatform: string;
  sort: number;
  sessionStatus: boolean;
}

export interface RushTimeSettingListParams {
  sessionName: string;
  sessionStatus?: boolean;
}

export type RushTimeSettingCreateForm = Omit<RushTimeSettingItem, 'id'>;
export type RushTimeSettingUpdateForm = RushTimeSettingItem;
export interface RushTimeSettingStatus {
  id: number;
  status: boolean;
}

// 获取抢购时间设置列表
export function fetchRushTimeSettingList(params: RushTimeSettingListParams) {
  return request<RushTimeSettingItem[]>({
    url: '/api/sessions',
    params,
  });
}

// 新增抢购时间设置
export function createRushTimeSetting(data: RushTimeSettingCreateForm) {
  return request({
    url: '/api/sessions',
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 编辑抢购时间设置
export function updateRushTimeSetting(data: RushTimeSettingUpdateForm) {
  return request({
    url: '/api/sessions',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除抢购时间设置
export function deleteRushTimeSetting(id: number) {
  return request({
    url: `/api/sessions/${id}`,
    method: 'delete',
  }, {
    loading: true,
  });
}

// 更新抢购时间设置状态
export function updateRushTimeSettingStatus(data: RushTimeSettingStatus) {
  return request({
    url: '/api/sessions/status',
    method: 'patch',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}
