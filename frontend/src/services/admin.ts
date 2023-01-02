import { patch, post, _api_request_raw } from "./api-utils";

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

export async function disableUser(handle: string): Promise<boolean> {
    return (await patch('admin-user-status', {handle: handle}, {disabled: true})).__status === 200;
}

export async function enableUser(handle: string): Promise<boolean> {
    return (await patch('admin-user-status', {handle: handle}, {disabled: false})).__status === 200;
}