import { useUserStore } from '@/stores/user';
import { get, post, patch, type ApiBodyType, _api_request_raw } from './api-utils';
import type { UserPostType } from './posts';

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
    posts: UserPostType[],
};

export type AdminUserProfileType = {
    handle: string,
    display_name: string,
    email: string,
    disabled: string,
    admin: string,
    created_at: string,
    updated_at: string,
}

export async function getAllUsers(): Promise<AdminUserProfileType[]|false> {
    const response =  await _api_request_raw('user-get-all', 'GET', {});

    if (response.status !== 200) return false;
    return await response.json();
}

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

export async function updateDetails(handle: string, body: ApiBodyType): Promise<boolean|string[]> {
    const data = await patch('user-settings-details', { handle: handle }, body);

    if (data.__status === 200) {
        useUserStore().handle = data.handle;
        useUserStore().display_name = data.display_name;
        return true;
    } else {
        return data['message'];
    }
}

export async function updatePassword(handle: string, body: ApiBodyType): Promise<boolean|string[]> {
    const data = await patch('user-settings-password', { handle: handle }, body);

    if (data.__status === 200) {
        return true;
    } else {
        return data['message'];
    }
}