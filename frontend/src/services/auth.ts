import { useUserStore } from '@/stores/user';
import { get, post, _api_request_raw, type ApiBodyType } from './api-utils';

export async function login(body: ApiBodyType): Promise<boolean> {
    const user = useUserStore();
    const data = await post('login', {}, body);

    if (data.__status === 201) {
        user.login(data.handle, data.display_name, data.email);

        // we try to load likes and dislikes for the user
        // it should fail silently as it is not part of the login process
        // we are just collecting some more data if we can
        const likes = await _api_request_raw('user-profile', 'GET', { handle: data.handle });
        if (likes.status === 200) {
            let json = await likes.json();
            user.registerAllLikes(json.likes);
            user.registerAllDislikes(json.dislikes);
        }

        return true;
    } else {
        return false;
    }
}

export async function register(body: ApiBodyType): Promise<boolean|string[]> {
    const data = await post('register', {}, body);

    if (data.__status === 201) {
        useUserStore().login(data.handle, data.display_name, data.email);
        return true;
    } else {
        return data['message'];
    }
}

export async function authStatus(): Promise<boolean> {
    const data = await get('auth-status');
    return data.__status === 200;
}

export async function logout() {
    await get('logout');
    useUserStore().logout();
}