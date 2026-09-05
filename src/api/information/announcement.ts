import type { InformationPosition } from '@/constants/information';
import request from '@/utils/axios';

export interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  position: InformationPosition;
  createTime: string;
}

export type AnnouncementCreateForm = Omit<AnnouncementItem, 'id' | 'createTime'>;
export type AnnouncementUpdateForm = Omit<AnnouncementItem, 'createTime'>;

// 获取公告列表
export function fetchAnnouncementList(params: AnyObj) {
  return request<AnnouncementItem[]>({
    url: '/api/notices',
    params,
  });
}

// 新增公告
export function createAnnouncement(data: AnnouncementCreateForm) {
  return request({
    url: '/api/notices',
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 编辑公告
export function updateAnnouncement(data: AnnouncementUpdateForm) {
  return request({
    url: '/api/notices',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除公告
export function deleteAnnouncement(id: number) {
  return request({
    url: `/api/notices/${id}`,
    method: 'delete',
  }, {
    loading: true,
  });
}
