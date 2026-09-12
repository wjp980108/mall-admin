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
  receiverName: string;
  receiveAddress: string;
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
  /** 积分不足时管理员确认仍继续执行 */
  confirmInsufficient?: boolean;
}

export interface RobOrderCancelForm {
  orderId: number;
  /** 积分不足时管理员确认仍继续执行 */
  confirmInsufficient?: boolean;
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
  return request<RobOrderOperationData | null>({
    url: `${ROB_ORDER_API}/transfer`,
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
  return request<RobOrderOperationData | null>({
    url: `${ROB_ORDER_API}/cancel`,
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: false,
    errorMessage: false,
  });
}
