<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import type { ProfileUpdateForm } from '@/api/profile';
import { fetchUserInfo, uploadImage } from '@/api';
import { updateProfile } from '@/api/profile';
import { fileStoragePlatform } from '@/constants/common';
import { Regex } from '@/enums/regex';
import { useUserStore } from '@/stores/user';

defineOptions({ name: 'Profile' });

const userStore = useUserStore();
const formRef = useTemplateRef<FormInstance>('formRef');
const saving = ref(false);

const profile = reactive<ProfileUpdateForm>({
  id: 0,
  nickname: '',
  phone: '',
  email: '',
  gender: 0,
  avatar: '',
  avatarPlatform: 'local-1',
});

const userInfo = computed(() => userStore.userInfo);
const userInitial = computed(() => userInfo.value.nickname?.charAt(0).toUpperCase() || 'U');
const uploadPlatformOptions = Object.entries(fileStoragePlatform);

const rules: FormRules<ProfileUpdateForm> = {
  nickname: { required: true, message: '请输入昵称', trigger: 'blur' },
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: new RegExp(Regex.Phone), message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
};

function resetProfile() {
  Object.assign(profile, {
    id: userInfo.value.id,
    nickname: userInfo.value.nickname ?? '',
    phone: userInfo.value.phone ?? '',
    email: userInfo.value.email ?? '',
    gender: userInfo.value.gender ?? 0,
    avatar: userInfo.value.avatar ?? '',
    avatarPlatform: userInfo.value.avatarPlatform ?? 'local-1',
  });
  formRef.value?.clearValidate();
}

function uploadAvatar(data: FormData) {
  data.append('platform', profile.avatarPlatform ?? 'local-1');
  return uploadImage(data);
}

async function handleSave() {
  try {
    await formRef.value?.validate();
    saving.value = true;

    await updateProfile(profile);

    const { data } = await fetchUserInfo();
    userStore.userInfo = data;
    resetProfile();
  }
  catch (error) {
    console.error(error);
  }
  finally {
    saving.value = false;
  }
}

onMounted(resetProfile);
</script>

<template>
  <div class="main-container profile-page">
    <app-card class="profile-card">
      <div class="profile-card__header">
        <div>
          <h2>个人信息</h2>
          <p>修改后会同步更新当前登录账号的信息。</p>
        </div>
      </div>

      <el-divider />

      <app-form ref="formRef" :model="profile" :rules :cols="2" label-width="88px">
        <app-form-item label="头像" prop="avatar">
          <app-upload
            v-model="profile.avatar" type="image" :api="uploadAvatar" circle width="80px"
            height="80px"
          >
            <template #trigger>
              <el-avatar :size="80" class="profile-avatar">
                {{ userInitial }}
              </el-avatar>
            </template>
            <template #tip>
              <span />
            </template>
          </app-upload>
        </app-form-item>
        <app-form-item label="存储平台" help-info="头像将上传到所选平台">
          <el-select
            v-model="profile.avatarPlatform" placeholder="请选择存储平台"
            :disabled="!!profile.avatar" :clearable="false"
          >
            <el-option
              v-for="[value, label] in uploadPlatformOptions" :key="value" :label="label"
              :value="value"
            />
          </el-select>
        </app-form-item>
        <app-form-item label="用户名">
          <el-input :model-value="userInfo.username" disabled />
        </app-form-item>
        <app-form-item label="昵称" prop="nickname">
          <el-input
            v-model="profile.nickname" placeholder="请输入昵称" maxlength="20"
            show-word-limit
          />
        </app-form-item>
        <app-form-item label="手机号" prop="phone">
          <el-input v-model="profile.phone" placeholder="请输入手机号" maxlength="11" />
        </app-form-item>
        <app-form-item label="邮箱" prop="email">
          <el-input v-model="profile.email" placeholder="请输入邮箱" />
        </app-form-item>
        <app-form-item label="性别" prop="gender">
          <el-radio-group v-model="profile.gender">
            <el-radio :value="0">
              未知
            </el-radio>
            <el-radio :value="1">
              男
            </el-radio>
            <el-radio :value="2">
              女
            </el-radio>
          </el-radio-group>
        </app-form-item>
      </app-form>

      <el-divider />

      <div class="profile-card__actions">
        <el-button @click="resetProfile">
          重置
        </el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          保存
        </el-button>
      </div>
    </app-card>
  </div>
</template>

<style scoped lang="scss">
.profile-card {
  &__header {
    h2,
    p {
      margin: 0;
    }

    h2 {
      font-size: 18px;
      font-weight: 600;
    }

    p {
      margin-top: var(--spacing-xs);
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}

.profile-avatar {
  color: #fff;
  background: var(--el-color-primary);
}
</style>
