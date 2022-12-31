import { useUserStore } from "@/stores/user";
import { get, post, _api_request_raw, type ApiBodyType } from "./api-utils";

export type PostType = {
    id: number;
    title: string;
    description: string;
    language: string;
    content: string;
    total_likes: number;
    total_dislikes: number;
    author: {
        handle: string;
        display_name: string;
    };
};


export async function getAllowedLanguages() {
    const response = await _api_request_raw('post-languages', 'GET', {});
    if (response.status !== 200) return {};
    return response.json();
}

export async function createPost(body: ApiBodyType) {
    const data = await post('post-new', {}, body);

    if (data.__status === 201) {
        return true;
    } else {
        return data['message'];
    }
}



export async function loadPosts(limit: number, page: number): Promise<PostType[]> {
    const response = await _api_request_raw(
        'post-get-all', 
        'GET', 
        { limit: String(limit), page: String(page) }
    );

    if (response.status !== 200) return [];

    return response.json();
}

export async function likePost(id: number) {
    // this is a "go back to neutral"
    if (useUserStore().likes.has(id)) return neutralPost(id); 

    const data = await post('post-like', {id: String(id)});
    if (data.__status === 201) {
        useUserStore().likePost(id);
    }
}

export async function dislikePost(id: number) {
    // this is a "go back to neutral"
    if (useUserStore().dislikes.has(id)) return neutralPost(id); 

    const data = await post('post-dislike', {id: String(id)});
    if (data.__status === 201) {
        useUserStore().dislikePost(id);
    }
}

export async function neutralPost(id: number) {
    const data = await post('post-neutral', {id: String(id)});
    if (data.__status === 201) {
        useUserStore().neutralPost(id);
    }
}