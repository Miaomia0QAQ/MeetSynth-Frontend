import { Result } from "../types/api";
import request from "../utils/request";

// 获取已审核申请列表
export async function getReviewedApplicationsAPI(
    page: number,
    pageSize: number,
    username?: string
): Promise<Result> {
    return request({
        url: 'admin/permissions/reviewed',
        method: 'get',
        params: username ? { page, pageSize, username } : { page, pageSize }
    });
}

// 获取待审核申请列表
export async function getPendingApplicationsAPI(
    page: number,
    pageSize: number,
    username?: string
): Promise<Result> {
    return request({
        url: 'admin/permissions/pending',
        method: 'get',
        params: username ? { page, pageSize, username } : { page, pageSize }
    });
}

// 提交审核结果
export async function submitReviewResultAPI(
    key: number,
    status: string
): Promise<Result> {
    return request({
        url: 'admin/permissions/approving',
        method: 'post',
        params: { key, status }
    });
}

// 申请成为管理员
export async function applyForAdminAPI(reason: string): Promise<Result> {
    return request({
        url: 'users/permissions/apply',
        method: 'post',
        params: { reason }
    });
}