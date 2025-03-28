import { Result } from "../types/api";
import request from "../utils/request";

// 获取系统关键指标
export async function getMetricsAPI(): Promise<Result> {
    return request({
        url: 'system/metrics',
        method: 'get'
    });
}

// 获取用户活跃度
export async function getUserActivityTrendsAPI(start: string, end: string): Promise<Result> {
    return request({
        url: 'system/activity',
        method: 'get',
        params: {
            start,
            end
        }
    });
}