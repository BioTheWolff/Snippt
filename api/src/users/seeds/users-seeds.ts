import { CreateUserDto } from "../dto/create-user.dto";

export const usersSeeds: (CreateUserDto & { admin: boolean, disabled: boolean } )[] = [
    { handle: "test", display_name: "My Test", email: "test@example.com", password: "abcdefgh", password_confirm: "abcdefgh", admin: false, disabled: false },
    { handle: "supertest", display_name: "My Super Test", email: "super@example.com", password: "abcdefgh", password_confirm: "abcdefgh", admin: true, disabled: false }
]