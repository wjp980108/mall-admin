import request from '@/utils/axios';

export interface ProductItem {
  id: number;
  goodsName: string;
  price: number;
  stock: number;
  sales: number;
  goodsThumb: string;
  goodsThumbPlatform: string;
  status: boolean;
  createTime: string;
}

export interface ProductListParams {
  goodsName: string;
  status?: number;
}

export type ProductCreateForm = Omit<ProductItem, 'id' | 'createTime'>;
export type ProductUpdateForm = Omit<ProductItem, 'createTime'>;

export interface ProductStatus {
  id: number;
  status: boolean;
}

// 获取商品列表
export function fetchProductList(params: ProductListParams) {
  return request<ProductItem[]>({
    url: '/api/goods',
    params,
  });
}

// 新增商品
export function createProduct(data: ProductCreateForm) {
  return request({
    url: '/api/goods',
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 编辑商品
export function updateProduct(data: ProductUpdateForm) {
  return request({
    url: '/api/goods',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除商品
export function deleteProduct(id: number) {
  return request({
    url: `/api/goods/${id}`,
    method: 'delete',
  }, {
    loading: true,
  });
}

// 更新商品状态
export function updateProductStatus(data: ProductStatus) {
  return request({
    url: '/api/goods/status',
    method: 'patch',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}
