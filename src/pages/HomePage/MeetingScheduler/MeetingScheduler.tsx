import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MeetingScheduler.css';
import { useNavigate } from 'react-router-dom';
import { animate } from 'framer-motion';

interface MeetingForm {
    title: string;
    description: string;
    leader: string;
    participants: string[];
    startTime: string;
    files: File[];
}

interface MeetingSchedulerProps {
    activeSection: string;
}

const MeetingScheduler = ({ activeSection }: MeetingSchedulerProps) => {
    const [formData, setFormData] = useState<MeetingForm>({
        title: '',
        description: '',
        leader: '',
        participants: [],
        startTime: '',
        files: []
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Meeting Scheduled:', formData);
        alert('会议预定成功！');
        // 跳转至 '/meeting'
        navigate('/meeting')
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'participants' ? value.split(',').map(p => p.trim()) : value
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFormData(prev => ({
                ...prev,
                files: [...prev.files, ...Array.from(files)]
            }));
        }
    };

    return (
        <div className="schedule-container" ref={containerRef}>
            <h1 className="header">预定会议</h1>

            <div className="content-wrapper">

                <form className="form-container" onSubmit={handleSubmit}>
                    {[
                        { label: '会议标题', name: 'title', type: 'text', required: true },
                        { label: '负责人', name: 'leader', type: 'text', required: true },
                        { label: '参与人', name: 'participants', type: 'text', placeholder: '张三, 李四, 王五' },
                        { label: '开始时间', name: 'startTime', type: 'datetime-local', required: true },
                        { label: '上传文件', name: 'files', type: 'file' },
                        { label: '会议简述', name: 'description', type: 'textarea', required: true },
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
                                {field.type === 'file' ? (
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        accept=".doc,.docx,.pdf"
                                        multiple
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name as keyof MeetingForm] as string}
                                        onChange={handleInputChange}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                    />
                                )}
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