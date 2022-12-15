import { usersSeeds } from "../../users/seeds/users-seeds";
import { CreatePostDto } from "../dto/create-post.dto";

export type PostSeedType = ( CreatePostDto & { _id: number, author: string } );
export type PostLikesType = ( { user: string, post: number } );
export type PostDislikesType = PostLikesType;

export const postsSeeds: PostSeedType[] = [
    {
        _id: 0,
        title: "My very first post",
        description: "Lorem ipsum dolor sin amet.",
        language: "python",
        author: usersSeeds[0].handle,
        content: 
`def main():
    return "hooray!"
`
    },
    {
        _id: 1,
        title: "NestJS 101",
        description: "Lorem ipsum dolor sin amet.",
        language: "javascript",
        author: usersSeeds[1].handle,
        content:
`export const seeds: (MyDto & { myVar: string })[] = [];
export function test() {}`
    }
];

export const likesSeeds: PostLikesType[] = [
    { user: usersSeeds[0].handle, post: postsSeeds[0]._id },
    { user: usersSeeds[0].handle, post: postsSeeds[1]._id },
    { user: usersSeeds[1].handle, post: postsSeeds[1]._id },
]

export const dislikesSeeds: PostDislikesType[] = [
    { user: usersSeeds[1].handle, post: postsSeeds[0]._id },
    { user: usersSeeds[2].handle, post: postsSeeds[1]._id },
]