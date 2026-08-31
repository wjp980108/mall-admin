import type { PendingPaymentOrderItem } from '@/api/rushOrder/pendingPaymentOrder';
import { pick } from 'lodash-es';
import { useReset } from '@/hooks/useReset';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<PendingPaymentOrderItem>(() => ({
    orderId: '',
    productName: '',
    price: 0,
    bidAt: '',
    remainingPaymentTime: '',
    buyerId: '',
    buyerPhone: '',
    buyerName: '',
    buyerParentNickname: '',
    buyerTopNickname: '',
    sellerPhone: '',
    sellerName: '',
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
