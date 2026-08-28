import request from '@/utils/axios';

export interface CanceledRushOrderItem {
  orderNo: string;
  goodsId: number;
  goodsName: string;
  sellerId: number;
  sellerPhone: string;
  sellerName: string;
  buyerId: number;
  buyerPhone: string;
  buyerName: string;
  rushPrice: number;
  receiveAddress: string;
  createTime: string;
}

export interface CanceledRushOrderListParams {
  orderNo: '';
  timeRange: [string, string];
}

// 获取已取消订单列表
export function fetchCanceledRushOrderList(params: CanceledRushOrderListParams) {
  return request<CanceledRushOrderItem[]>({
    url: '/api/order/list/cancel',
    params,
  });
}
