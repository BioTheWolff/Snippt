
export function getBodyFromError(code: number, message: string) {
    let error: string;
    switch (code) {
        case 400:
            error = "Bad Request"; break;
        default:
            error = "Unknown code?"
    }


    return {
        statusCode: code,
        error: error,
        message: message,
    }
}