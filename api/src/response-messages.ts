
export const responseMessages = {
    // Generic HTTP responses
    NOT_MODIFIED: "Not Modified",

    // Databse related
    UKN_DB_ERROR: "The database has encountered an unknown error",

    // Auth
    REGISTRATION_FAILED: "Failed to register user account",
    TARGET_NOT_SELF: "Cannot take action on a resource that is not owned",

    // Updates
    EMPTY_MODIF_DTO: "Empty modification request",
    UPDATE_NONEXIST_USER: "User to update was not found",

    // User-specific
    HANDLE_IN_USE: "Handle is already taken",
    EMAIL_IN_USE: "Email is already taken",
    WRONG_OLD_PASS: "Old password is incorrect",

    // Followers system
    USER_NOT_FOUND: "User not found",
    FOLLOW_SELF_FORBIDDEN: "Impossible to follow yourself",

    // Posts
    POST_NOT_FOUND: "Post not found",
    PARENT_NOT_FOUND: "Cannot answer to non-existing post",
}