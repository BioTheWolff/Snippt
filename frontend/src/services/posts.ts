import { useUserStore } from "@/stores/user";
import { get, patch, post, _api_request_raw, type ApiBodyType } from "./api-utils";
import type { UserProfileInfoType } from "./users";

export type UserPostType = {
    id: number;
    title: string;
    description: string;
    language: string;
    content: string;
    total_likes: number;
    total_dislikes: number;
    parent: number|null;
    answers: PostType[];
    deleted?: boolean;
}

export type PostType = UserPostType & { author: UserProfileInfoType };


export async function getAllowedLanguages() {
    const response = await _api_request_raw('post-languages', 'GET', {});
    if (response.status !== 200) return {};
    return response.json();
}

export async function createPost(body: ApiBodyType): Promise<number|[]> {
    const data = await post('post-new', {}, body);

    if (data.__status === 201) {
        return data.id;
    } else {
        return data['message'];
    }
}

export async function editPost(id: string, body: ApiBodyType): Promise<number|[]> {
    const data = await patch('post-edit', {id: id}, body);

    if (data.__status === 200) {
        return data.id;
    } else {
        return data['message'];
    }
}


export async function answerPost(id: string, body: ApiBodyType): Promise<number|[]> {
    const data = await post('post-answer', {id: id}, body);

    if (data.__status === 201) {
        return data.id;
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

export async function getSinglePost(id: string): Promise<PostType> {
    return await get('post-get-single', {id: id}) as {} as PostType;
}

export async function viewPost(id: string): Promise<PostType[]> {
    const response = await _api_request_raw('post-get', 'GET', { id: id });

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