import request from '@/utils/axios';

export interface RobOrderFlowItem {
  logId: number;
  eventType: 1 | 2 | 3;
  eventTypeName: string;
  eventTime: string;
  orderId: number;
  orderNo: string;
  goodsId: number;
  goodsName: string;
  goodsSn: string;
  goodsThumb: string;
  sessionId: number;
  sessionName: string;
  buyerId: number;
  buyerName: string;
  buyerPhone: string;
  quantity: number;
  unitPrice: number;
  signedTotalAmount: number;
  operatorId: number;
  operatorName: string;
  remark: string;
}

export interface RobOrderFlowListParams {
  operateType?: 1 | 2 | 3;
  timeRange: [string, string];
}

export interface RobOrderFlowEvent {
  logId: number;
  remark: string;
  eventTime: string;
  eventType: 1 | 2 | 3;
  operatorId: number;
  afterStatus: 1 | 2;
  beforeStatus: 1 | 2;
  operatorName: string;
  eventTypeName: string;
  afterStatusName: string;
  beforeStatusName: string;
}

export interface RobOrderFlowDetail {
  id: number;
  events: RobOrderFlowEvent[];
  buyerId: number;
  goodsId: number;
  goodsSn: string;
  orderNo: string;
  quantity: number;
  buyerName: string;
  goodsName: string;
  inviterId: number;
  sessionId: number;
  unitPrice: number;
  buyerPhone: string;
  createTime: string;
  goodsThumb: string;
  buyerAvatar: string;
  inviterName: string;
  orderStatus: 1 | 2;
  rushEndTime: string;
  sessionName: string;
  totalAmount: number;
  profitAmount: number;
  receiverName: string;
  receiverPhone: string;
  rushStartTime: string;
  selfBuyAmount: number;
  receiveAddress: string;
  orderStatusName: string;
  recommendAmount: number;
  sessionProductId: number;
  selfBuyBonusAmount: number;
  selfBuyCouponAmount: number;
}

export interface RobOrderFlowSummaryParams {
  timeRange?: string;
}

export interface RobOrderFlowSummary {
  net: {
    totalAmount: number;
  };
}

// 获取订单流水分页列表
export function fetchRobOrderFlowList(params: RobOrderFlowListParams) {
  return request<AppAxios.PageData<RobOrderFlowItem>>({
    url: '/api/robOrderFlows',
    params,
  });
}

// 获取订单流水区间汇总
export function fetchRobOrderFlowSummary(params: RobOrderFlowSummaryParams) {
  return request<RobOrderFlowSummary>({
    url: '/api/robOrderFlows/summary',
    params,
  });
}

// 获取单笔订单流水详情
export function fetchRobOrderFlowDetail(orderId: number) {
  return request<RobOrderFlowDetail>({
    url: `/api/robOrderFlows/${orderId}`,
  });
}
