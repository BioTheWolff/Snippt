import { get, post } from './utils';

export type UserProfileType = {
    __status: number,
    handle: string,
    display_name: string,
};

export async function userProfile(handle: string): Promise<UserProfileType> {
    return await get('user-profile', { handle: handle }) as UserProfileType
}