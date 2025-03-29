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

// 获取活跃用户数
export async function getActiveUserCountAPI(): Promise<Result> {
    return request({
        url: 'system/activeUser',
        method: 'get',
    });
}

// 获取每日会议数
export async function getDailyMeetingCountAPI(start: string, end: string): Promise<Result> {
    return request({
        url: 'system/meeting',
        method: 'get',
        params: {
            start,
            end
        }
    });
}