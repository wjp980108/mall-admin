import request from '@/utils/axios';

export interface UserListParams {
  username: string;
}

export type UserCreateForm = Omit<User.Item, 'id'>;
export type UserUpdateForm = User.Item;
export interface UserUpdateStatus {
  userId: number;
  status: boolean;
}

// 获取用户列表
export function fetchUserList(params: UserListParams) {
  return request<AppAxios.PageData<User.Item>>({
    url: '/api/users',
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
