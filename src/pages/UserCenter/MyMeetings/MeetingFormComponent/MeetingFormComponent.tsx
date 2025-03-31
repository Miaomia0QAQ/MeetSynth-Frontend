import React from 'react';
import { CreateMeetingParams } from '../../../../types/api';

interface MeetingFormProps {
    formData: CreateMeetingParams;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const MeetingFormComponent = ({ formData, onInputChange }: MeetingFormProps) => (
    <form className="form-container">
        {[
            { label: '会议标题', name: 'title', type: 'text' },
            { label: '负责人', name: 'leader', type: 'text' },
            { label: '参与人', name: 'participants', type: 'text', placeholder: '张三, 李四, 王五' },
            { label: '开始时间', name: 'startTime', type: 'datetime-local' },
            { label: '会议简述', name: 'description', type: 'textarea' },
        ].map((field) => (
            field.type === 'textarea' ? (
                <div key={field.name} className="form-group description">
                    <label>{field.label}：</label>
                    <textarea
                        name={field.name}
                        value={formData[field.name as keyof CreateMeetingParams] as string}
                        onChange={onInputChange}
                    />
                </div>
            ) : (
                <div key={field.name} className="form-group">
                    <label>{field.label}：</label>
                    <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name as keyof CreateMeetingParams] as string}
                        onChange={onInputChange}
                        placeholder={field.placeholder}
                    />
                </div>
            )
        ))}
    </form>
);