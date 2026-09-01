<script setup lang="ts">
import { fetchUserAgreement, updateUserAgreement } from '@/api/generalManagement/userAgreement';

defineOptions({ name: 'GeneralManagementUserAgreement' });

const content = ref('');
const loading = ref(false);
const saving = ref(false);

async function getUserAgreement() {
  loading.value = true;

  try {
    const { data } = await fetchUserAgreement();
    content.value = data.content;
  }
  catch (error) {
    console.error(error);
  }
  finally {
    loading.value = false;
  }
}

async function handleSave() {
  saving.value = true;

  try {
    await updateUserAgreement({
      title: '用户协议',
      content: content.value,
    });
  }
  catch (error) {
    console.error(error);
  }
  finally {
    saving.value = false;
  }
}

onMounted(getUserAgreement);
</script>

<template>
  <div class="main-container">
    <app-card v-loading="loading" class="min-h-0 flex flex-1 flex-col">
      <app-editor v-model="content" class="agreement-editor" />
      <div class="flex justify-end pt-12">
        <el-button type="primary" :loading="saving" @click="handleSave">
          保存
        </el-button>
      </div>
    </app-card>
  </div>
</template>

<style scoped lang="scss">
.agreement-editor {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;

  :deep(.app-editor-content) {
    flex: 1;
    min-height: 0;
    height: auto !important;
  }

  :deep(.w-e-scroll) {
    overflow-y: auto;
  }
}
</style>
