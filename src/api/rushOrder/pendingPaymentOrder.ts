import request from '@/utils/axios';

/**
 * 待付款订单接口占位：后端接口和字段确认后统一替换。
 */
const PENDING_PAYMENT_ORDER_API = '/api/rush-orders/pending-payment';

export interface PendingPaymentOrderItem {
  id: number;
  orderNo: string;
  goodsId: number;
  goodsName: string;
  buyerId: number;
  buyerPhone: string;
  buyerName: string;
  rushPrice: number;
  receiveAddress: string;
  sellerId: number;
  sellerPhone: string;
  sellerName: string;
  createTime: string;
}

export interface PendingPaymentOrderListParams {
  orderNo: '';
  timeRange: [string, string];
}

export type PendingPaymentOrderUpdateForm = PendingPaymentOrderItem;

export interface PendingPaymentOrderStatus {
  id: number;
  remark: string;
}

// 获取待付款订单列表
export function fetchPendingPaymentOrderList(params: PendingPaymentOrderListParams) {
  return request<PendingPaymentOrderItem[]>({
    url: '/api/order/list/waitPay',
    params,
  });
}

// 取消待确认收款订单
export function cancelPendingReceiptOrder(data: PendingPaymentOrderStatus) {
  return request({
    url: '/api/order/cancel',
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 编辑待付款订单
export function updatePendingPaymentOrder(data: PendingPaymentOrderUpdateForm) {
  return request({
    url: PENDING_PAYMENT_ORDER_API,
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除待付款订单
export function deletePendingPaymentOrder(data: PendingPaymentOrderStatus) {
  return request({
    url: '/api/order/delete',
    method: 'delete',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}
