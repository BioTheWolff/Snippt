import { ref } from 'vue'
import { defineStore } from 'pinia'

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
  }

  return { handle, display_name, email, is_logged_in, login, logout };
},
{
  persist: true,
})