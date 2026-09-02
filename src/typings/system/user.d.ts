declare namespace User {
  import type { Platform } from '../../constants/common.ts';

  interface Item {
    id: number;
    username: string;
    password?: string;
    nickname: string;
    phone: string;
    avatar: string;
    platform: Platform;
    email: string;
    gender: 0 | 1 | 2;
    roleIds: number[];
    status: boolean;
    remark: string;
  }

  interface CurrentUser {
    id: number;
    username: string;
    nickname: string;
    phone: string;
    email: string | null;
    gender: 0 | 1 | 2;
    avatar: string;
    avatarPlatform: Platform | null;
    permissions: string[];
  }
}
