import { Result } from "../types/api";
import request from "../utils/request";

export async function loginAPI(data: { email: string; password: string;[key: string]: any }): Promise<Result<{token: string}>> {
    const requestData = {
        email: data.email,
        password: data.password
    }

    return request({
        url: 'users/login',
        method: 'POST',
        params: requestData
    });
}