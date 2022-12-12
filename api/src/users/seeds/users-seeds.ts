import { CreateUserDto } from "../dto/create-user.dto";

export const usersSeeds: (CreateUserDto & { admin?: boolean, disabled?: boolean } )[] = [
    { handle: "test", display_name: "My Test", email: "test@example.com", password: "abcdefgh", password_confirm: "abcdefgh" },
    { handle: "supertest", display_name: "My Super Test", email: "super@example.com", password: "abcdefgh", password_confirm: "abcdefgh", admin: true },
    { handle: "famousguy", display_name: "Famous guy!!", email: "famous@example.com", password: "abcdefgh", password_confirm: "abcdefgh" },
];

function h(index: number) {
    return usersSeeds[index].handle;
}

// from handle to handle, use function to automatically gather handles from seeds
export const followersSeeds: { from: string, to: string }[] = [
    { from: h(0), to: h(1) },
    { from: h(0), to: h(2) },
    { from: h(1), to: h(2) }
];