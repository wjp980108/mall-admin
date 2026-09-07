import request from '@/utils/axios';

export interface SessionProductItem {
  id: number;
  sessionId: number;
  sessionName: string;
  goodsId: number;
  goodsName: string;
  categoryName?: string;
  goodsSn?: string;
  goodsThumb?: string;
  goodsThumbPlatform?: string;
  price: number;
  goodsStock: number;
  stock: number;
  sort: number;
  createTime?: string;
  updateTime?: string;
}

export interface SessionProductCandidateItem {
  id: number;
  goodsName: string;
  goodsPrice: number;
  coverImg: string;
}

export interface SessionProductCandidateParams {
  onlineStatus?: 0 | 1;
  pageNum?: number;
  pageSize?: number;
}

export interface SessionProductBatchCreateForm {
  sessionId: number;
  items: Array<{
    goodsId: number;
    stock: number;
    sort?: number;
  }>;
}

export interface SessionProductUpdateForm {
  id: number;
  sessionId: number;
  goodsId: number;
  stock: number;
  sort?: number;
}

// 获取可关联的抢购商品列表
export function fetchSessionProductCandidates(params: SessionProductCandidateParams) {
  return request<AppAxios.PageData<SessionProductCandidateItem>>({
    url: '/api/consign-goods',
    params,
  });
}

// 获取指定场次已关联商品
export function fetchSessionProductBySessionId(sessionId: number) {
  return request<SessionProductItem[]>({
    url: `/api/sessionProducts/bySession/${sessionId}`,
  });
}

// 批量关联商品到场次
export function createSessionProducts(data: SessionProductBatchCreateForm) {
  return request({
    url: '/api/sessionProducts',
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 修改场次商品库存或排序
export function updateSessionProduct(data: SessionProductUpdateForm) {
  return request({
    url: '/api/sessionProducts',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除场次商品关联
export function deleteSessionProduct(id: number) {
  return request({
    url: `/api/sessionProducts/${id}`,
    method: 'delete',
  }, {
    loading: true,
  });
}
