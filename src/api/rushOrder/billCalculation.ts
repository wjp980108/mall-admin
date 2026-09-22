import request from '@/utils/axios';

export interface BillCalculationItem {
  userId: number;
  userName: string;
  phone: string;
  todayPurchaseAmount: number;
  todayConsignmentAmount: number;
  todayPaymentAmount: number;
  todayReceiptAmount: number;
  yesterdayPurchaseAmount: number;
  yesterdayConsignmentAmount: number;
  yesterdayPaymentAmount: number;
  yesterdayReceiptAmount: number;
  todayShareAmount: number;
  payableAmount: number;
}

export interface BillCalculationListParams {
  date?: string;
  keyword?: string;
}

// 获取账单计算列表
export function fetchBillCalculationList(params: BillCalculationListParams) {
  return request<AppAxios.PageData<BillCalculationItem>>({
    url: '/api/robOrderBills',
    params,
  });
}

// 导出账单计算 PDF
export function exportRobOrderBillsPDF(params: BillCalculationListParams) {
  return request<Blob, Promise<Blob>>({
    url: '/api/robOrderBills/exportRobOrderBillsPDF',
    params,
    responseType: 'blob',
  }, {
    loading: '正在导出…',
  });
}
