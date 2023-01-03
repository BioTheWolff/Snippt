import { delete_, patch, _api_request_raw } from "./api-utils";
import type { UserProfileInfoType } from "./users";

export type AdminUserProfileType = {
    id: number,
    handle: string,
    display_name: string,
    email: string,
    disabled: string,
    admin: string,
    created_at: string,
    updated_at: string,
}
export type AdminPostType = {
    id: number,
    title: string,
    description: string,
    language: string,
    content: string,
    deleted: string,
    author: UserProfileInfoType,
}

export async function getAllUsers(): Promise<AdminUserProfileType[]|false> {
    const response =  await _api_request_raw('user-get-all', 'GET', {});

    if (response.status !== 200) return false;
    return await response.json();
}

export async function disableUser(handle: string): Promise<boolean> {
    return (await patch('admin-user-status', {handle: handle}, {disabled: true})).__status === 200;
}

export async function enableUser(handle: string): Promise<boolean> {
    return (await patch('admin-user-status', {handle: handle}, {disabled: false})).__status === 200;
}


export async function getAllPosts(): Promise<AdminPostType[]|false> {
    const response =  await _api_request_raw('post-admin-get-all', 'GET', {});

    if (response.status !== 200) return false;
    return await response.json();
}

export async function deletePost(id: string): Promise<boolean> {
    return (await delete_('post-delete', {id: id})).__status === 200;
}