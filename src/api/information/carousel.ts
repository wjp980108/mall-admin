import request from '@/utils/axios';

export interface CarouselItem {
  id: number;
  imgUrl: string;
  position: '';
  sort: number;
  imgUrlPlatform: string;
  createdTime: string;
}

export type CarouselCreateForm = Omit<CarouselItem, 'id' | 'createdTime'>;
export type CarouselUpdateForm = Omit<CarouselItem, 'createdTime'>;

// 获取轮播图列表
export function fetchCarouselList(params: AnyObj) {
  return request<CarouselItem[]>({
    url: '/api/banners',
    params,
  });
}

// 新增轮播图
export function createCarousel(data: CarouselCreateForm) {
  return request({
    url: '/api/banners',
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 编辑轮播图
export function updateCarousel(data: CarouselUpdateForm) {
  return request({
    url: '/api/banners',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除轮播图
export function deleteCarousel(id: number) {
  return request({
    url: `/api/banners/${id}`,
    method: 'delete',
  }, {
    loading: true,
  });
}
