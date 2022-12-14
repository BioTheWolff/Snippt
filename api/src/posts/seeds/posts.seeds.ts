import { usersSeeds } from "src/users/seeds/users-seeds";
import { CreatePostDto } from "../dto/create-post.dto";

export const postsSeeds: (CreatePostDto & { author: string })[] = [
    {
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
        title: "NestJS 101",
        description: "Lorem ipsum dolor sin amet.",
        language: "javascript",
        author: usersSeeds[1].handle,
        content:
`export const seeds: (MyDto & { myVar: string })[] = [];
export function test() {}`
    }
];