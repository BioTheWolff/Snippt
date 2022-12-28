import { get, post } from './api-utils';

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