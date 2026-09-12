<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { changePassword } from '@/api/profile';
import { useReset } from '@/hooks/useReset';
import { useUserStore } from '@/stores/user';

defineOptions({ name: 'ChangePassword' });

const visible = defineModel<boolean>({ default: false });
const router = useRouter();
const userStore = useUserStore();

const [form, reset] = useReset(() => ({
  password: '',
  confirmPassword: '',
}));

const rules: FormRules<typeof form.value> = {
  password: { required: true, message: '请输入新密码', trigger: 'blur' },
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.value.password)
          callback(new Error('两次输入的密码不一致'));
        else
          callback();
      },
      trigger: 'blur',
    },
  ],
};

const formRef = useTemplateRef<FormInstance>('formRef');
const saving = ref(false);

async function handleConfirm() {
  try {
    await formRef.value?.validate();
    saving.value = true;
    await changePassword(form.value.password);
    userStore.handleLogout();
    visible.value = false;
    await router.replace('/login');
  }
  finally {
    saving.value = false;
  }
}
</script>

<template>
  <app-popup
    v-model="visible" title="修改密码" width="440" :loading="saving"
    @closed="reset" @confirm="handleConfirm"
  >
    <app-form ref="formRef" :model="form" :rules label-width="88px">
      <app-form-item label="新密码" prop="password">
        <el-input
          v-model="form.password" type="password" placeholder="请输入新密码" show-password
          autocomplete="new-password"
        />
      </app-form-item>
      <app-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码"
          show-password autocomplete="new-password"
        />
      </app-form-item>
    </app-form>
  </app-popup>
</template>
