import type { StateTree } from "pinia";
import type { Serializer } from "pinia-plugin-persistedstate";

function serialize(value: StateTree): string {
    let temp = {...value};
    
    temp.likes = Array.from(temp.likes);
    temp.dislikes = Array.from(temp.dislikes);

    return JSON.stringify(temp);
}

function deserialize(value: string): StateTree {
    let temp = JSON.parse(value);

    temp.likes = new Set(temp.likes);
    temp.dislikes = new Set(temp.dislikes);

    return temp;
}

export const userSerializer: Serializer = {serialize, deserialize};;