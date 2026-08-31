import type { RushOrderItem } from '@/api/rushOrder/allOrder';
import { pick } from 'lodash-es';
import { useReset } from '@/hooks/useReset';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<RushOrderItem>(() => ({
    id: 0,
    orderNo: '',
    productName: '',
    buyerName: '',
    productPrice: 0,
    quantity: 1,
    totalAmount: 0,
    status: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    remark: '',
  }));

  const showForm = ref(false);

  function setState(value: RushOrderItem) {
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
