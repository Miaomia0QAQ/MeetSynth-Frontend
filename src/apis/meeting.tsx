import { CreateMeetingParams, Result } from "../types/api";
import { meetingInfo } from "../types/meetingInfo";
import request from "../utils/request";

// 获取会议信息
export async function getMeetingAPI(id: string): Promise<Result> {
    return request({
        url: 'meeting/getInfo',
        method: 'get',
        params: { id }
    });
}

// 获取用户会议列表
export async function getUserMeetingListAPI(
    page: number,
    pageSize: number,
    title?: string,
    description?: string
): Promise<Result> {
    return request({
        url: 'meeting/user/list',
        method: 'get',
        params: {
            page,
            pageSize,
            ...(title && { title }),
            ...(description && { description })
        }
    });
}

/**
 * 创建会议接口
 * @param params 创建会议参数（所有字段均为可选）
 */
export async function createMeetingAPI(params: CreateMeetingParams): Promise<Result> {
    return request({
        url: 'meeting/create',
        method: 'post',
        data: {
            title: params.title,
            description: params.description,
            participants: params.participants,
            leader: params.leader,
            startTime: params.startTime
        },
    });
}

// 删除会议
export async function deleteMeetingAPI(id: string): Promise<Result> {
    return request({
        url: 'meeting/delete',
        method: 'post',
        params: { id }
    });
}

// 修改会议信息
export async function updateMeetingAPI(params: meetingInfo): Promise<Result> {
    return request({
        url: 'meeting/updateInfo',
        method: 'post',
        params: {
            id: params.id,
            title: params.title,
            description: params.description,
            participants: params.participants,
            leader: params.leader,
            startTime: params.startTime
        }
    })
}

// 保存录音转译文字
export async function saveTranscriptAPI(id: string, transcript: string): Promise<Result> {
    return request({
        url: 'meeting/saveRecording',
        method: 'post',
        data: {
            id,
            recording: transcript,
        }
    })
}

// 保存ai总结
export async function saveAISummaryAPI(id: string, summary: string): Promise<Result> {
    return request({
        url: 'meeting/saveAISummary',
        method: 'post',
        params: {
            id,
            content: summary,
        }
    })
}

// 上传会议文件
export async function uploadFileAPI(id: string, file: File): Promise<Result> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id);
    return request({
        url: 'upload/file',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}