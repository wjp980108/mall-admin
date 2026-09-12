<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { forgotPassword } from '@/api';
import { useReset } from '@/hooks/useReset.ts';

defineOptions({ name: 'ForgotPassword' });

const visible = defineModel<boolean>({ default: false });

const formRef = useTemplateRef<FormInstance>('formRef');
const saving = ref(false);

const [form, reset] = useReset(() => ({
  account: '',
  password: '',
  confirmPassword: '',
}));

const rules: FormRules<typeof form.value> = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
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

async function handleConfirm() {
  if (!formRef.value)
    return;

  await formRef.value.validate();

  saving.value = true;
  try {
    await forgotPassword({
      account: form.value.account,
      password: form.value.password,
    });
    visible.value = false;
  }
  finally {
    saving.value = false;
  }
}
</script>

<template>
  <app-popup
    v-model="visible" title="重置密码" width="440" :loading="saving"
    @closed="reset" @confirm="handleConfirm"
  >
    <app-form ref="formRef" :model="form" :rules label-width="88px">
      <app-form-item label="用户名" prop="account">
        <el-input v-model="form.account" placeholder="请输入用户名" />
      </app-form-item>
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
