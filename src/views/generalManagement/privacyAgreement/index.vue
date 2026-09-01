<script setup lang="ts">
defineOptions({ name: 'GeneralManagementPrivacyAgreement' });

const content = ref('');

function handleSave() {
  ElMessage.info('隐私协议保存接口暂未接入');
}
</script>

<template>
  <div class="main-container">
    <app-card class="min-h-0 flex flex-1 flex-col">
      <app-editor v-model="content" class="agreement-editor" />
      <div class="flex justify-end pt-12">
        <el-button type="primary" @click="handleSave">
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
