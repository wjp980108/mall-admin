import request from '@/utils/axios';

export interface UserListParams {
  username: string;
}

export type UserCreateForm = Omit<User.Form, 'id'>;
export type UserUpdateForm = User.Form;
export interface UserUpdateStatus {
  userId: number;
  status: boolean;
}

export interface UserRelationItem {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  status: boolean;
  createTime: string;
  inviteCode: string;
  memberType: 0 | 1;
}

export interface UserRelations {
  upline: UserRelationItem | null;
  downlines: UserRelationItem[];
}

export interface UserPointsBalance {
  points: number;
  couponPoints: number;
}

export interface UserPointsFlow {
  id: number;
  amount: number;
  remark: string | null;
  bizType: 1 | 2 | 3 | 4;
  bizTypeName: string;
  orderId: number | null;
  orderNo: string | null;
  flowType: 1 | 2 | 3 | 4;
  flowTypeName: string;
  accountType: 1 | 2;
  accountTypeName: string;
  beforePoints: number;
  afterPoints: number;
  counterpartyUserId: number | null;
  counterpartyName: string | null;
  createTime: string;
}

export interface UserPointsDetail extends AppAxios.PageData<UserPointsFlow> {
  current: number;
  pages: number;
  size: number;
  balance: UserPointsBalance;
}

export interface UserPointsParams {
  pageNum: number;
  pageSize: number;
  bizType?: UserPointsFlow['bizType'];
}

// 获取用户列表
export function fetchUserList(params: UserListParams) {
  return request<AppAxios.PageData<User.Item>>({
    url: '/api/users',
    params,
  });
}

// 查询用户上下级邀请关系
export function fetchUserRelations(id: number) {
  return request<UserRelations>({
    url: `/api/users/relations/${id}`,
  });
}

// 查询用户积分详情
export function fetchUserPoints(id: number, params: UserPointsParams) {
  return request<UserPointsDetail>({
    url: `/api/users/points/${id}`,
    params,
  });
}

// 获取角色列表
export function fetchRoleList() {
  return request<Role.Item[]>({
    url: '/api/roles/all',
  });
}

// 创建用户
export function createUser(data: UserCreateForm) {
  return request({
    url: '/api/users',
    method: 'post',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 编辑用户
export function updateUser(data: UserUpdateForm) {
  return request({
    url: '/api/users',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}

// 删除用户
export function deleteUser(id: number) {
  return request({
    url: '/api/users',
    method: 'delete',
    data: {
      userIds: [id],
    },
  }, {
    loading: true,
  });
}

// 更新用户状态
export function updateUserStatus(data: UserUpdateStatus) {
  return request({
    url: '/api/users/status',
    method: 'patch',
    data,
  }, {
    loading: true,
    successMessage: true,
  });
}
