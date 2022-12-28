import { useUserStore } from '@/stores/user';
import { get, post, patch, type ApiBodyType } from './api-utils';

export type UserProfileInfoType = {
    handle: string,
    display_name: string,
}

export type UserProfileType = {
    __status: number,
    handle: string,
    display_name: string,
    following: UserProfileInfoType[],
    followers: UserProfileInfoType[],
};

export async function userProfile(handle: string): Promise<UserProfileType> {
    return await get('user-profile', { handle: handle }) as UserProfileType
}

export async function followUser(handle: string): Promise<boolean> {
    const result = await post('user-follow', { handle: handle });
    return result.__status === 201;
}

export async function unfollowUser(handle: string): Promise<boolean> {
    const result = await post('user-unfollow', { handle: handle });
    return result.__status === 201;
}

// user settings
export async function updateEmail(handle: string, body: ApiBodyType): Promise<boolean|string[]> {
    const data = await patch('user-settings-email', { handle: handle }, body);

    if (data.__status === 200) {
        useUserStore().email = data.email;
        return true;
    } else {
        return data['message'];
    }
}