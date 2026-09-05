import type { CarouselItem, CarouselUpdateForm } from '@/api/information/carousel';
import { pick } from 'lodash-es';
import { useReset } from '@/hooks/useReset';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<CarouselUpdateForm>(() => ({
    id: 0,
    imgUrl: '',
    position: 'home',
    sort: 0,
    imgUrlPlatform: 'local-1',
  }));

  const showForm = ref(false);

  function setState(value: CarouselItem) {
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
