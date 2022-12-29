
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