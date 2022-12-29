import { _api_request_raw } from "./api-utils";

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

export async function loadPosts(limit: number, page: number): Promise<PostType[]> {
    const response = await _api_request_raw(
        'post-get-all', 
        'GET', 
        { limit: String(limit), page: String(page) }
    );

    if (response.status !== 200) return [];

    return response.json();
}