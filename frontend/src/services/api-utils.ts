
export type ApiParamsType = { [key: string]: string };
export type ApiBodyType = { [key: string]: any };
export type TableColType = { 
    field: string, 
    label: string, 
    numeric?: boolean, 
    boolean?: boolean,
    preprocessor?: (data: any) => any,
};
export type TableColumnsType = TableColType[];

const BASE_URL: string = "/api";
const ENDPOINTS: { [key: string]: string } = {
    // make an endpoint with params like so:
    // my_endpoint: '/api/users/$username$/settings

    // auth
    'login': '/auth/login',
    'logout': '/auth/logout',
    'register': '/auth/register',
    'auth-status': '/auth/status',

    // users
    'user-get-all': '/users/',
    'user-profile': '/users/$handle$?relations=true',
    'user-follow': '/users/$handle$/follow',
    'user-unfollow': '/users/$handle$/unfollow',

    // user settings
    'user-settings-email': '/users/$handle$/email',
    'user-settings-details': '/users/$handle$/details',
    'user-settings-password': '/users/$handle$/password',

    // posts
    'post-get-all': '/posts?limit=$limit$&page=$page$',
    'post-get': '/posts/$id$/chain',
    'post-answer': '/posts/$id$/answer',
    'post-like': '/posts/$id$/like',
    'post-dislike': '/posts/$id$/dislike',
    'post-neutral': '/posts/$id$/neutral',
    'post-languages': '/posts/languages',
    'post-new': '/posts',
    'post-delete': '/posts/$id$',

    // admin
    'admin-user-status': '/users/$handle$/status',
    'post-admin-get-all': '/posts/admin',
};


export async function _api_request_raw(
    endpoint: string, 
    method: string, 
    params: ApiParamsType, 
    body?: ApiBodyType
) : Promise<Response> 
{
    // populate endpoint with params
    let fragment = ENDPOINTS[endpoint];
    for (let p in params) {
        fragment = fragment.replace(`$${p}$`, params[p]);
    }

    return await fetch(BASE_URL + fragment, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null,
    });
}

async function _api_request(
    endpoint: string, 
    method: string, 
    params: ApiParamsType, 
    body?: ApiBodyType
) : Promise<{ __status: number, [name: string]: any }> 
{
    const response = await _api_request_raw(endpoint, method, params, body);
    return {
        __status: response.status,
        ...(await response.json())
    };
}

export async function get(endpoint: string, params?: ApiParamsType) {
    return await _api_request(endpoint, 'GET', params ?? {});
}

export async function post(endpoint: string, params?: ApiParamsType, body?: ApiBodyType) {
    return await _api_request(endpoint, 'POST', params ?? {}, body);
}

export async function patch(endpoint: string, params?: ApiParamsType, body?: ApiBodyType) {
    return await _api_request(endpoint, 'PATCH', params ?? {}, body);
}

export async function delete_(endpoint: string, params?: ApiParamsType, body?: ApiBodyType) {
    return await _api_request(endpoint, 'DELETE', params ?? {}, body);
}