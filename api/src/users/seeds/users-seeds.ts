import { CreateUserDto } from "../dto/create-user.dto";

export const usersSeeds: CreateUserDto[] = [
    { handle: "test", display_name: "My Test", email: "test@example.com", password: "abcdefgh" }
]