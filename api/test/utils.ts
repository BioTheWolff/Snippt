
export function getBodyFromError(code: number, message?: string) {
    if (code === 404) {
        return { statusCode: 404, message: 'Not Found' };
    }

    let error: string;
    switch (code) {
        case 304: error = "Not Modified"; break;
        case 400: error = "Bad Request"; break;
        case 403: error = "Forbidden"; break;
        default:  error = "Unknown code?"
    }


    return {
        statusCode: code,
        error: error,
        message: message ?? "No message provided",
    }
}