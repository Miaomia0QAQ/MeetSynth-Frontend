import { Result } from "../types/api";
import request from "../utils/request";


// 登录
export async function loginAPI(data: { email: string; password: string;[key: string]: any }): Promise<Result<{ token: string }>> {
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

// 获取用户信息
export async function getUserInfoAPI(): Promise<Result> {
    return request({
        url: 'users/info',
        method: 'get',
    });
}

// 修改用户名
export async function updateUsernameAPI(username: string): Promise<Result> {
    const data = { username }
    return request({
        url: 'users/update/username',
        method: 'POST',
        params: data,
    });
}


// 修改头像
export async function updateAvatarAPI(file: any): Promise<Result> {
    return request({
        url: 'users/update/avatar',
        method: 'POST',
        data: {
            avatar: file,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

// 验证原密码
export async function validatePasswordAPI(password: string): Promise<Result> {
    return request({
        url: 'users/identify/password',
        method: 'POST',
        params: { password }
    });
}

// 验证邮箱
export async function validateEmailAPI(captcha: string): Promise<Result> {
    return request({
        url: 'users/identify/email',
        method: 'POST',
        params: { captcha }
    });
}

// 修改密码
export async function updatePasswordAPI(password: string): Promise<Result> {
    return request({
        url: 'users/update/password',
        method: 'POST',
        params: { password }
    });
}

// 注销账号
export async function deleteAccountAPI(): Promise<Result> {
    return request({
        url: 'users/delete',
        method: 'POST'
    });
}

// 发送验证码
export async function sendcaptchaAPI(email: string): Promise<Result> {
    return request({
        url: 'users/captcha',
        method: 'POST',
        params: { email }
    });
}

// 注册
export async function registerAPI(authData: any): Promise<Result> {
    return request({
        url: 'users/register',
        method: 'POST',
        params: authData
    });
}

// 获取用户列表
export async function getUserListAPI(page: number, pageSize: number, username?: string): Promise<Result> {
    return request({
        url: 'admin/users/list',
        method: 'get',
        params: username ? { page, pageSize, username } : { page, pageSize }
    });
}

// 管理员删除用户
export async function deleteUserAPI(id: string): Promise<Result> {
    return request({
        url: 'admin/users/delete',
        method: 'POST',
        params: { id }
    });
}