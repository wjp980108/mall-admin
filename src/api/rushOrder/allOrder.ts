import request from '@/utils/axios';

/**
 * 抢购商品订单接口占位：后端接口和字段确认后统一替换。
 */
const RUSH_ORDER_API = '/api/rush-orders';

export interface RushOrderItem {
  id: number;
  orderNo: string;
  productName: string;
  buyerName: string;
  productPrice: number;
  quantity: number;
  totalAmount: number;
  status: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  remark: string;
  createdAt?: string;
}

export interface RushOrderListParams {
  orderNo: string;
  productName: string;
  buyerName: string;
  status?: string;
}

export type RushOrderCreateForm = Omit<RushOrderItem, 'id' | 'createdAt'>;
export type RushOrderUpdateForm = Omit<RushOrderItem, 'createdAt'>;

// 获取所有抢购订单
export function fetchRushOrderList(params: RushOrderListParams) {
  return request<AppAxios.PageData<RushOrderItem>>({
    url: RUSH_ORDER_API,
    params,
  });
}

// 新增抢购订单
export function createRushOrder(data: RushOrderCreateForm) {
  return request({
    url: RUSH_ORDER_API,
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 编辑抢购订单
export function updateRushOrder(data: RushOrderUpdateForm) {
  return request({
    url: RUSH_ORDER_API,
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除抢购订单
export function deleteRushOrder(id: number) {
  return request({
    url: RUSH_ORDER_API,
    method: 'delete',
    data: {
      ids: [id],
    },
  }, {
    loading: true,
  });
}
