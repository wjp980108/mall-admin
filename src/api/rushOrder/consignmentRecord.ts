import request from '@/utils/axios';

export interface RushConsignmentRecordItem {
  orderNo: string;
  buyerId: number;
  buyerPhone: string;
  buyerName: string;
  sellerId: number;
  sellerPhone: string;
  sellerName: string;
  goodsId: number;
  goodsName: string;
  rushPrice: number;
  putCommission: number;
  consignmentType: string;
  reviewStatus: string;
  createTime: string;
}

export interface RushConsignmentRecordListParams {
  orderNo: '';
  orderStatus: number | string;
  timeRange: [string, string];
}

// 获取代售记录列表
export function fetchRushConsignmentRecordList(params: RushConsignmentRecordListParams) {
  return request<RushConsignmentRecordItem[]>({
    url: '/api/order/list/agentSale',
    params,
  });
}
