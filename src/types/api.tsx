// 基础响应结构
export interface Result<T = any> {
    code: number;    // 状态码
    msg: string;     // 消息
    data: T;         // 泛型数据
}

// 创建会议参数
export interface CreateMeetingParams {
    title?: string;         // 会议标题
    description?: string;   // 会议描述
    participants?: string; // 参会人员列表
    leader?: string;        // 负责人
    startTime?: string;     // 开始时间（格式：yyyy-mm-dd hh:mm:ss）
}