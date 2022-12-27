
import { useUserStore } from '@/stores/user';
import { post, type ApiBodyType } from './utils';

export async function login(body: ApiBodyType): Promise<boolean> {
    const data = await post('login', {}, body);

    if (data.__status === 201) {
        useUserStore().login(data.handle, data.display_name, data.email);
        return true;
    } else {
        return false;
    }
}

export async function logout() {
    useUserStore().logout();
}