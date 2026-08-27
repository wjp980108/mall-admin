import type { ProductItem, ProductUpdateForm } from '@/api/product/list';
import { pick } from 'lodash-es';
import { useReset } from '@/hooks/useReset';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<ProductUpdateForm>(() => ({
    id: 0,
    goodsName: '',
    price: 0,
    stock: 0,
    sales: 0,
    goodsThumb: '',
    goodsThumbPlatform: 'local-1',
    status: true,
  }));

  const showForm = ref(false);

  function setState(val: ProductItem) {
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
