
export type ApiParamsType = { [key: string]: string };
export type ApiBodyType = { [key: string]: any };

const BASE_URL: string = "/api";
const ENDPOINTS: { [key: string]: string } = {
    // make an endpoint with params like so:
    // my_endpoint: '/api/users/$username$/settings
};

async function _api_request(
    endpoint: string, 
    method: string, 
    params: ApiParamsType, 
    body?: ApiBodyType
) : Promise<{ [name: string]: any }> 
{
    // populate endpoint with params
    let fragment = ENDPOINTS[endpoint];
    for (let p in params) {
        fragment = fragment.replace(`$${p}$`, params[p]);
    }

    const response = await fetch(BASE_URL + fragment, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body ?? {})
    });
    return response.json();
}

export async function get(endpoint: string, params: ApiParamsType) {
    return await _api_request(endpoint, 'GET', params);
}

export async function post(endpoint: string, params: ApiParamsType, body: ApiBodyType) {
    return await _api_request(endpoint, 'GET', params, body);
}