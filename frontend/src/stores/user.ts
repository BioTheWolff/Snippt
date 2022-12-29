import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { userSerializer } from './_utils';

export const useUserStore = defineStore('user', () => {
  const handle = ref("");
  const display_name = ref("");
  const email = ref("");
  const is_logged_in = ref(false);

  function login(_handle: string, _display_name: string, _email: string) {
    handle.value = _handle;
    display_name.value = _display_name;
    email.value = _email;
    is_logged_in.value = true;
  }
  function logout() {
    handle.value = "";
    display_name.value = "";
    email.value = "";
    is_logged_in.value = false;

    likes.value.clear();
    dislikes.value.clear();
  }

  const likes: Ref<Set<number>> = ref(new Set());
  const dislikes: Ref<Set<number>> = ref(new Set());

  function registerAllLikes(ids: number[]) {
    for (let id of ids) likePost(id);
  }

  function registerAllDislikes(ids: number[]) {
    for (let id of ids) dislikePost(id);
  }

  function likePost(id: number) {
    neutralPost(id);
    likes.value.add(id);
  }

  function dislikePost(id: number) {
    neutralPost(id);
    dislikes.value.add(id);
  }

  function neutralPost(id: number) {
    likes.value.delete(id);
    dislikes.value.delete(id);
  }

  return { 
    handle, display_name, email, 
    is_logged_in, 
    login, logout,
    likes, dislikes, 
    likePost, dislikePost, neutralPost,
    registerAllLikes, registerAllDislikes
  };
},
{
  persist: {
    serializer: userSerializer,
  }
})