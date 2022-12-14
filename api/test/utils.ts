import * as request from 'supertest';


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

export function getTokenFromResponse(response) {
    return response
        .headers['set-cookie'][0] // getting headers
        .split(";")[0] // splitting by cookie info
        .split("=")[1]; // getting the value
}

export function getBearerFromResponse(response) {
    return 'Bearer ' + getTokenFromResponse(response);
}

export async function loginAndGetToken(app, email: string, password: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: email,
        password: password
      });
    return getBearerFromResponse(response);
  }