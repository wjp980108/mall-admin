import type { PendingPaymentOrderItem } from '@/api/rushOrder/pendingPaymentOrder';
import { pick } from 'lodash-es';
import { useReset } from '@/hooks/useReset';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<PendingPaymentOrderItem>(() => ({
    id: 0,
    orderNo: '',
    goodsId: 0,
    goodsName: '',
    buyerId: 0,
    buyerPhone: '',
    buyerName: '',
    rushPrice: 0,
    receiveAddress: '',
    sellerId: 0,
    sellerPhone: '',
    sellerName: '',
    createTime: '',
  }));

  const showForm = ref(false);

  function setState(value: PendingPaymentOrderItem) {
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
