import type { RushProductItem } from '@/api/product/rushList.ts';
import { pick } from 'lodash-es';
import { useReset } from '@/hooks/useReset';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<RushProductItem>(() => ({
    id: 0,
    goodsName: '',
    goodsPrice: 0,
    memberId: '',
    sessionId: '',
    coverImg: '',
    coverImgPlatform: 'local-1',
    detailImg: '',
    detailImgPlatform: 'local-1',
    goodsDetail: '',
    onlineStatus: true,
  }));

  const showForm = ref(false);

  function setState(val: RushProductItem) {
    Object.assign(state.value, pick(val, Object.keys(state.value)));
    showForm.value = true;
  }

  return {
    state,
    reset,
    showForm,
    setState,
  };
});
