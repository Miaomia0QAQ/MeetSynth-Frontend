import React, { useState, useEffect, useRef } from 'react';
import './MeetingScheduler.css';
import { useNavigate } from 'react-router-dom';
import { createMeetingAPI } from '../../../apis/meeting';
import { message, Modal } from 'antd';
import { CreateMeetingParams } from '../../../types/api';

interface MeetingForm {
    title: string;
    description: string;
    leader: string;
    participants: string[];
    startTime: string;
}

interface MeetingSchedulerProps {
    activeSection: string;
}

const MeetingScheduler = ({ activeSection }: MeetingSchedulerProps) => {
    const [formData, setFormData] = useState<CreateMeetingParams>({
        title: '',
        description: '',
        leader: '',
        participants: '',
        startTime: '',
    });
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const formGroupsRef = useRef<Array<HTMLDivElement | null>>([]);
    const [isAnimateIn, setIsAnimateIn] = useState(false);

    useEffect(() => {
        if (activeSection === 'schedule') {
            setIsAnimateIn(true);
        } else {
            setIsAnimateIn(false);
        }
    }, [activeSection]);

    useEffect(() => {
        if (isAnimateIn) {
            containerRef.current?.classList.add('animate-in');
            formGroupsRef.current.forEach((formGroup) => {
                formGroup?.classList.add('animate-in');
            });
        } else {
            containerRef.current?.classList.remove('animate-in');
            formGroupsRef.current.forEach(formGroup => {
                formGroup?.classList.remove('animate-in');
            })
        }
    }, [isAnimateIn]);

    // 处理表单提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 调用创建会议接口
            const res = await createMeetingAPI(formData);

            if (res.code === 1) {
                Modal.confirm({
                    title: '预定成功',
                    content: '会议预定成功！',
                    okText: '进入会议',
                    cancelText: '知道了',
                    onOk: () => {
                        // 跳转到会议室页面，使用接口返回的会议号
                        navigate(`/meeting?id=${res.data}`);
                    },
                });
            } else {
                // 处理业务逻辑错误
                message.error(res.msg || '会议预定失败');
            }
        } catch (err) {
            // 处理网络错误
            message.error('请求失败，请检查网络连接');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="schedule-container" ref={containerRef}>
            <h1 className="header">预定会议</h1>

            <div className="content-wrapper">

                <form className="form-container" onSubmit={handleSubmit}>
                    {[
                        { label: '会议标题', name: 'title', type: 'text', required: false },
                        { label: '负责人', name: 'leader', type: 'text', required: false },
                        { label: '参与人', name: 'participants', type: 'text', placeholder: '张三, 李四, 王五' },
                        { label: '开始时间', name: 'startTime', type: 'datetime-local', required: false },
                        { label: '会议简述', name: 'description', type: 'textarea', required: false },
                    ].map((field, index) => (
                        field.type === 'textarea' ? (
                            <div
                                key={field.name}
                                ref={el => { formGroupsRef.current[index] = el }}
                                className="form-group description"
                            >
                                <label>{field.label}：</label>
                                <textarea
                                    name={field.name}
                                    value={formData[field.name as keyof MeetingForm] as string}
                                    onChange={handleInputChange}
                                    required={field.required}
                                />
                            </div>
                        ) : (
                            <div
                                key={field.name}
                                ref={el => { formGroupsRef.current[index] = el }}
                                className="form-group"
                            >
                                <label>{field.label}：</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name as keyof MeetingForm] as string}
                                    onChange={handleInputChange}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                />
                            </div>
                        )
                    ))}
                </form>

                <div className="right-section">
                    <div className="background-overlay" />
                    <button
                        type="submit"
                        className="submit-button"
                        onClick={handleSubmit}
                    >
                        提交预定
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MeetingScheduler;