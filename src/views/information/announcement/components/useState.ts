import type { AnnouncementItem, AnnouncementUpdateForm } from '@/api/information/announcement';
import { pick } from 'lodash-es';
import { useReset } from '@/hooks/useReset';

export const useState = createSharedComposable(() => {
  const [state, reset] = useReset<AnnouncementUpdateForm>(() => ({
    id: 0,
    title: '',
    content: '',
  }));

  const showForm = ref(false);

  function setState(val: AnnouncementItem) {
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
