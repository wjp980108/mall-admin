import type { RushTimeSettingItem } from '@/api/rushSystem/timeSetting';
import { pick } from 'lodash-es';
import { useReset } from '@/hooks/useReset';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<RushTimeSettingItem>(() => ({
    id: 0,
    sessionName: '',
    rushStartTime: '',
    rushEndTime: '',
    enterControlMinute: 0,
    maxBuyCount: 0,
    beforeForbidMinute: 0,
    afterForbidMinute: 0,
    bgImg: '',
    bgImgPlatform: 'local-1',
    sort: 0,
    sessionStatus: true,
  }));

  const showForm = ref(false);

  function setState(value: RushTimeSettingItem) {
    Object.assign(state.value, pick(value, Object.keys(state.value)));
    showForm.value = true;
  }

  return {
    state,
    reset,
    showForm,
    setState,
  };
});
