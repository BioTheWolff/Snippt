import { CreateUserDto } from "../dto/create-user.dto";

export const usersSeeds: CreateUserDto[] = [
    { handle: "test", display_name: "My Test", email: "test@example.com", password: "abcdefgh" },
    { handle: "supertest", display_name: "My Super Test", email: "super@example.com", password: "abcdefgh" }
]