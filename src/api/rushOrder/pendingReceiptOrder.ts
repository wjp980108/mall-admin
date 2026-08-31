import request from '@/utils/axios';

export interface PendingReceiptOrderItem {
  id: number;
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

export interface PendingReceiptOrderListParams {
  orderNo: '';
  timeRange: [string, string];
}

export interface CancelPendingReceiptOrder {
  id: number;
  remark: string;
}

// 获取待确认收款订单列表
export function fetchPendingReceiptOrderList(params: PendingReceiptOrderListParams) {
  return request<PendingReceiptOrderItem[]>({
    url: '/api/order/list/waitConfirm',
    params,
  });
}

// 确认待确认收款订单
export function confirmPendingReceiptOrder(id: number) {
  return request({
    url: '/api/order/cancel',
    method: 'delete',
    data: { id },
  }, {
    loading: true,
  });
}

// 取消待确认收款订单
export function cancelPendingReceiptOrder(data: CancelPendingReceiptOrder) {
  return request({
    url: '/api/order/cancel',
    method: 'delete',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}
