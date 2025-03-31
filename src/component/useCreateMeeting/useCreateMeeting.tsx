import { useState } from 'react';
import { message } from 'antd';
import { createMeetingAPI } from '../../apis/meeting'; 
import { CreateMeetingParams } from '../../types/api';
export const useCreateMeeting = () => {
    const [formData, setFormData] = useState<CreateMeetingParams>({
        title: '',
        description: '',
        leader: '',
        participants: '',
        startTime: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const res = await createMeetingAPI(formData);
            if (res.code === 1) {
                return res.data; // 返回会议ID
            }
            message.error(res.msg || '会议预定失败');
            return null;
        } catch (err) {
            message.error('请求失败，请检查网络连接');
            return null;
        }
    };

    return {
        formData,
        handleInputChange,
        handleSubmit,
        setFormData
    };
};