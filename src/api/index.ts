import request from '@/utils/axios';

export interface Login {
  account: string;
  password: string;
}

export interface PublicSystemSettings {
  siteName: string;
  siteLogo: string;
}

// 登录
export function login(data: Login) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data,
  });
}

// 忘记密码
export function forgotPassword(data: Login) {
  return request({
    url: '/api/auth/forgot-password',
    method: 'put',
    data,
  }, {
    loading: true,
    successMessage: '密码重置成功，请使用新密码登录',
  });
}

// 获取用户信息
export function fetchUserInfo() {
  return request<User.CurrentUser>({
    url: '/api/users/user-info',
  });
}

// 获取用户菜单
export function fetchUserMenu() {
  return request<Menu.Tree[]>({
    url: '/api/users/user-menus',
  });
}

// 获取企业级 JsSdk 签名参数
export function fetchCorpJsSdkParams(url: string) {
  return request({
    url: '/common/generateCorpJssdkParams',
    method: 'post',
    data: {
      url,
    },
  });
}

// 获取应用 JsSdk 签名参数
export function fetchAgentJsSdkParams(url: string) {
  return request({
    url: '/common/generateAgentJssdkParams',
    method: 'post',
    data: {
      url,
    },
  });
}

// 上传文件
export function uploadFile(params: FormData) {
  return request({
    url: '/common/acceptUpload',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }, {
    cancelDuplicateRequest: false,
    loading: '上传中...',
  });
}

// 上传图片
export function uploadImage(data: FormData) {
  return request<string>({
    url: '/api/file/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }, {
    cancelDuplicateRequest: false,
    loading: '上传中...',
  });
}

// 公开查询系统设置
export function fetchPublicSystemSettings() {
  return request<PublicSystemSettings>({
    url: '/api/settings/public',
  }, {
    errorMessage: false,
  });
}
