<script setup lang="ts">
import type { SystemSettings, SystemSettingsUpdateForm } from '@/api/system/settings';
import { fetchSystemSettings, updateSystemSettings } from '@/api/system/settings';

defineOptions({ name: 'SystemSettings' });

const saving = ref(false);

const settings = reactive<SystemSettingsUpdateForm>({
  id: 0,
  siteName: '',
  siteLogo: '',
  newMemberDays: 0,
  newMemberAdvanceMinutes: 0,
  limitRule: 0,
  recommendRate: 0,
  selfBuyRate: 0,
  selfBuyBonusRatio: 0,
  couponRatio: 0,
  orderProfitRate: 0,
});

const limitRuleOptions = [
  { label: '不限购', value: 0 },
  { label: '同一场次限购一次', value: 1 },
  { label: '同一商品限购一次', value: 2 },
];

function assignSettings(data: SystemSettings) {
  settings.id = data.id ?? 0;
  settings.siteName = data.siteName ?? '';
  settings.siteLogo = data.siteLogo ?? '';
  settings.newMemberDays = data.newMemberDays ?? 0;
  settings.newMemberAdvanceMinutes = data.newMemberAdvanceMinutes ?? 0;
  settings.limitRule = data.limitRule ?? 0;
  settings.recommendRate = data.recommendRate ?? 0;
  settings.selfBuyRate = data.selfBuyRate ?? 0;
  settings.selfBuyBonusRatio = data.selfBuyBonusRatio ?? 0;
  settings.couponRatio = data.couponRatio ?? 0;
  settings.orderProfitRate = data.orderProfitRate ?? 0;
}

async function getSettings() {
  const res = await fetchSystemSettings();
  assignSettings(res.data);
}

async function handleSave() {
  saving.value = true;

  try {
    await updateSystemSettings({ ...settings });
  }
  finally {
    saving.value = false;
  }
}

onMounted(getSettings);
</script>

<template>
  <div class="main-container">
    <el-form label-position="top">
      <app-flex vertical>
        <app-card>
          <div class="mb-16 border-[var(--el-border-color-lighter)] pb-16 border-b">
            <div class="text-16 font-600">
              站点设置
            </div>
            <div class="mt-4 text-13 text-[var(--el-text-color-secondary)]">
              设置站点名称与站点 Logo
            </div>
          </div>
          <el-form-item label="站点名称">
            <el-input v-model="settings.siteName" maxlength="128" show-word-limit placeholder="请输入站点名称" />
          </el-form-item>
          <el-form-item class="mb-0" label="站点 Logo">
            <app-upload v-model="settings.siteLogo" type="image" :file-size="5" />
          </el-form-item>
        </app-card>

        <app-card>
          <div class="mb-16 border-[var(--el-border-color-lighter)] pb-16 border-b">
            <div class="text-16 font-600">
              会员权益
            </div>
            <div class="mt-4 text-13 text-[var(--el-text-color-secondary)]">
              设置新会员的权益时效与提前抢单时间
            </div>
          </div>
          <div class="grid grid-cols-1 gap-x-16 md:grid-cols-2">
            <el-form-item label="新会员专享有效期（天）">
              <el-input-number v-model="settings.newMemberDays" :min="0" :precision="0" />
            </el-form-item>
            <el-form-item label="新会员提前抢单（分钟）">
              <el-input-number v-model="settings.newMemberAdvanceMinutes" :min="0" :precision="0" />
            </el-form-item>
          </div>
        </app-card>

        <app-card>
          <div class="mb-16 border-[var(--el-border-color-lighter)] pb-16 border-b">
            <div class="text-16 font-600">
              抢单规则设置
            </div>
            <div class="mt-4 text-13 text-[var(--el-text-color-secondary)]">
              设置会员限购与抢单相关比例
            </div>
          </div>
          <el-form-item label="会员限购规则">
            <el-select v-model="settings.limitRule" :clearable="false">
              <el-option v-for="item in limitRuleOptions" :key="item.value" v-bind="item" />
            </el-select>
          </el-form-item>
          <div class="grid grid-cols-1 gap-x-16 md:grid-cols-2">
            <el-form-item label="推荐奖励比例（%）">
              <el-input-number v-model="settings.recommendRate" :min="0" :precision="2" />
            </el-form-item>
            <el-form-item label="自购奖励比例（%）">
              <el-input-number v-model="settings.selfBuyRate" :min="0" :precision="2" />
            </el-form-item>
            <el-form-item label="自购奖金占比（%）">
              <el-input-number v-model="settings.selfBuyBonusRatio" :min="0" :max="100" :precision="2" />
            </el-form-item>
            <el-form-item label="购物券占比（%）">
              <el-input-number v-model="settings.couponRatio" :min="0" :max="100" :precision="2" />
            </el-form-item>
            <el-form-item class="mb-0" label="订单利润比例（%）">
              <el-input-number v-model="settings.orderProfitRate" :min="0" :precision="2" />
            </el-form-item>
          </div>
        </app-card>
      </app-flex>

      <div class="sticky bottom-0 z-10 flex justify-center py-12">
        <el-button type="primary" :loading="saving" @click="handleSave">
          保存系统设置
        </el-button>
      </div>
    </el-form>
  </div>
</template>
