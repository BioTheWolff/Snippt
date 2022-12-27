
import { useUserStore } from '@/stores/user';
import { post, type ApiBodyType } from './utils';

export const userStore = useUserStore();

export async function login(body: ApiBodyType): Promise<boolean> {
    const data = await post('login', {}, body);

    if (data.__status === 201) {
        userStore.login(data.handle, data.display_name, data.email);
        return true;
    } else {
        return false;
    }
}