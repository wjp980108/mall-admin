import request from '@/utils/axios';

const ROB_ORDER_API = '/api/robOrders';

export interface RobOrderItem {
  id: number;
  orderNo: string;
  sessionProductId: number;
  sessionId: number;
  sessionName: string;
  rushStartTime: string;
  rushEndTime: string;
  goodsId: number;
  goodsName: string;
  goodsSn: string;
  goodsThumb: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  profitAmount: number;
  recommendAmount: number;
  selfBuyAmount: number;
  selfBuyBonusAmount: number;
  selfBuyCouponAmount: number;
  buyerId: number;
  buyerName: string;
  buyerPhone: string;
  buyerAvatar: string;
  inviterId: number | null;
  inviterName: string | null;
  orderStatus: 1 | 2;
  orderStatusName: string;
  createTime: string;
}

export interface RobOrderListParams {
  timeRange: [string, string];
  keyword: string;
  orderStatus?: 1 | 2;
}

export interface RobOrderTransferForm {
  orderId: number;
  newBuyerId: number;
}

export interface UserOption {
  label: string;
  value: number;
}

// 获取抢购订单分页列表
export function fetchRobOrderList(params: RobOrderListParams) {
  return request<AppAxios.PageData<RobOrderItem>>({
    url: ROB_ORDER_API,
    params,
  });
}

// 获取启用用户下拉选项
export function fetchUserOptions() {
  return request<UserOption[]>({
    url: '/api/users/options',
  });
}

// 转移订单
export function transferRobOrder(data: RobOrderTransferForm) {
  return request({
    url: `${ROB_ORDER_API}/transfer`,
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 取消订单
export function cancelRobOrder(id: number) {
  return request({
    url: `${ROB_ORDER_API}/cancel/${id}`,
    method: 'put',
  }, {
    loading: true,
    successMessage: true,
  });
}
