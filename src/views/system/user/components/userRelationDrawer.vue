<script setup lang="ts">
import type { UserRelationItem, UserRelations } from '@/api/system/user';
import { fetchUserRelations } from '@/api/system/user';

defineOptions({ name: 'UserRelationDrawer' });

const visible = ref(false);
const loading = ref(false);
const user = ref<User.Item>();
const relations = ref<UserRelations>();

function getMemberTypeText(memberType: UserRelationItem['memberType']) {
  return memberType ? '老会员' : '新会员';
}

async function open(row: User.Item) {
  user.value = row;
  relations.value = undefined;
  visible.value = true;
  loading.value = true;

  try {
    const { data } = await fetchUserRelations(row.id);
    relations.value = data;
  }
  finally {
    loading.value = false;
  }
}

defineExpose({ open });
</script>

<template>
  <app-drawer v-model="visible" title="上下级关系" size="700" resizable :show-footer="false">
    <div v-loading="loading" class="relation-drawer">
      <template v-if="user">
        <section class="relation-stage relation-stage--upline">
          <div class="relation-stage__title">
            <span>上级邀请人</span>
          </div>
          <div v-if="relations?.upline" class="relation-card relation-card--upline">
            <el-avatar :size="44" class="relation-card__avatar">
              {{ relations.upline.nickname.slice(0, 1) }}
            </el-avatar>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-8">
                <span class="truncate font-600">{{ relations.upline.nickname }}</span>
                <span class="text-12 text-[var(--el-text-color-secondary)]">#{{ relations.upline.id }}</span>
              </div>
              <div class="mt-4 truncate text-12 text-[var(--el-text-color-secondary)]">
                {{ relations.upline.username }} · {{ relations.upline.phone }}
              </div>
            </div>
            <el-tag :type="relations.upline.memberType ? 'success' : 'info'" effect="plain" size="small">
              {{ getMemberTypeText(relations.upline.memberType) }}
            </el-tag>
          </div>
          <div v-else class="relation-empty">
            <app-icon icon="UserFilled" size="18" />
            暂无上级邀请人
          </div>
        </section>

        <div class="relation-connector">
          <span class="relation-connector__line" />
          <span class="relation-connector__dot" />
        </div>

        <section class="relation-stage relation-stage--current">
          <div class="relation-stage__title">
            <span>当前用户</span>
          </div>
          <div class="relation-current-card">
            <el-avatar :size="52" :src="user.avatar" class="relation-current-card__avatar">
              {{ user.nickname.slice(0, 1) }}
            </el-avatar>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-8">
                <span class="truncate text-16 font-600">{{ user.nickname }}</span>
                <span class="text-12 text-[var(--el-color-primary)]">#{{ user.id }}</span>
              </div>
              <div class="mt-6 flex flex-wrap gap-x-16 gap-y-4 text-12 text-[var(--el-text-color-secondary)]">
                <span>用户名：{{ user.username }}</span>
                <span>手机号：{{ user.phone || '-' }}</span>
              </div>
            </div>
          </div>
        </section>

        <div class="relation-connector">
          <span class="relation-connector__line" />
          <span class="relation-connector__dot" />
        </div>

        <section class="relation-stage relation-stage--downline">
          <div class="relation-stage__title">
            <span>直属邀请用户</span>
            <el-tag type="primary" effect="plain" size="small">
              {{ relations?.downlines.length ?? 0 }} 人
            </el-tag>
          </div>
          <div v-if="relations?.downlines.length" class="relation-downline-grid">
            <article v-for="item in relations.downlines" :key="item.id" class="relation-downline-card">
              <div class="min-w-0 flex items-center gap-8">
                <el-avatar :size="36" class="relation-downline-card__avatar">
                  {{ item.nickname.slice(0, 1) }}
                </el-avatar>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-6">
                    <span class="truncate font-600">{{ item.nickname }}</span>
                    <span class="shrink-0 text-12 text-[var(--el-text-color-secondary)]">#{{ item.id }}</span>
                  </div>
                  <div class="mt-4 truncate text-12 text-[var(--el-text-color-secondary)]">
                    {{ item.username }} · {{ item.phone }}
                  </div>
                </div>
              </div>
              <div class="relation-downline-card__footer">
                <el-tag :type="item.memberType ? 'success' : 'info'" effect="plain" size="small">
                  {{ getMemberTypeText(item.memberType) }}
                </el-tag>
                <span>{{ item.createTime }}</span>
              </div>
            </article>
          </div>
          <div v-else class="relation-empty relation-empty--downline">
            暂无直属邀请用户
          </div>
        </section>
      </template>
    </div>
  </app-drawer>
</template>

<style scoped lang="scss">
.relation-drawer {
  min-height: 0;
  padding: var(--spacing-lg);
}

.relation-stage {
  position: relative;
  width: min(100%, 620px);
  margin: 0 auto;
}

.relation-stage__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 600;
}

.relation-card,
.relation-current-card,
.relation-downline-card,
.relation-empty {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: var(--el-bg-color);
}

.relation-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-base);
}

.relation-card__avatar,
.relation-downline-card__avatar {
  flex-shrink: 0;
  background-color: var(--el-fill-color);
  color: var(--el-text-color-secondary);
}

.relation-empty {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border-style: dashed;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.relation-connector {
  position: relative;
  display: flex;
  height: var(--spacing-xl);
  justify-content: center;
}

.relation-connector__line {
  width: 1px;
  height: 100%;
  background: var(--el-color-primary-light-5);
}

.relation-connector__dot {
  position: absolute;
  bottom: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-color-primary);
}

.relation-current-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-base);
  border-left: 3px solid var(--el-color-primary);
}

.relation-current-card__avatar {
  flex-shrink: 0;
}

.relation-downline-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-md);
}

.relation-downline-card {
  min-width: 0;
  padding: var(--spacing-md);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    border-color: var(--el-color-primary-light-5);
    box-shadow: var(--el-box-shadow-lighter);
  }
}

.relation-downline-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--el-border-color-lighter);
  color: var(--el-text-color-secondary);
  font-size: 12px;
  white-space: nowrap;
}

@media (width <= 640px) {
  .relation-downline-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
