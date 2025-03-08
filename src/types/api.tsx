// 基础响应结构
export interface Result<T = any> {
    code: number;    // 状态码
    msg: string;     // 消息
    data: T;         // 泛型数据
}