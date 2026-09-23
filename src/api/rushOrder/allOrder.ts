import request from '@/utils/axios';

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
  receiverName: string;
  receiveAddress: string;
  buyerAvatar: string;
  inviterId: number | null;
  inviterName: string | null;
  orderStatus: 1 | 2;
  orderStatusName: string;
  /** 收款回款状态：0 未收款、1 已收款、2 已回款、3 无效 */
  payStatus: 0 | 1 | 2 | 3;
  createTime: string;
}

export interface RobOrderListParams {
  timeRange: [string, string];
  keyword: string;
  orderStatus?: 1 | 2;
  payStatus?: RobOrderItem['payStatus'];
}

export interface RobOrderTransferForm {
  orderId: number;
  newBuyerId: number;
  /** 积分不足时管理员确认仍继续执行 */
  confirmInsufficient?: boolean;
}

export interface RobOrderCancelForm {
  orderIds: number[];
  /** 积分不足时管理员确认仍继续执行 */
  confirmInsufficient?: boolean;
}

export interface RobOrderConfirmPayForm {
  orderIds: number[];
  /** 动作：1 确认收款、2 确认回款 */
  action: 1 | 2;
}

export interface InsufficientPointsUser {
  userId: number;
  nickname: string;
  phone: string;
  identityType: number;
  identityName: string;
  pointsInsufficient: boolean;
}

export interface RobOrderOperationData {
  /** 存在时表示有用户积分不足，需要二次确认 */
  users?: InsufficientPointsUser[];
}

export interface RobOrderBatchInsufficient {
  orderId: number;
  pointsInsufficient: RobOrderOperationData;
}

export interface UserOption {
  label: string;
  value: number;
}

// 获取抢购订单分页列表
export function fetchRobOrderList(params: RobOrderListParams) {
  return request<AppAxios.PageData<RobOrderItem>>({
    url: '/api/robOrders',
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
  return request<RobOrderOperationData | null>({
    url: '/api/robOrders/transfer',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: false,
    errorMessage: false,
  });
}

// 取消订单
export function cancelRobOrder(data: RobOrderCancelForm) {
  return request<RobOrderBatchInsufficient[] | null>({
    url: '/api/robOrders/cancel',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: false,
    errorMessage: false,
  });
}

// 确认收款/回款
export function confirmRobOrderPay(data: RobOrderConfirmPayForm) {
  return request({
    url: '/api/robOrders/confirmPay',
    method: 'put',
    data,
  }, {
    loading: true,
  });
}
