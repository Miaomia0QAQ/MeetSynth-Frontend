import { InboxOutlined } from '@ant-design/icons';
import { message, Modal, Upload, UploadProps } from 'antd';
import { createStyles } from 'antd-style';
import React from 'react'
import { uploadFileAPI } from '../../../apis/meeting';

interface UploadModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onOk: () => void;
    id: string;
}

const useStyle = createStyles(({ css }) => ({
    'info-modal-body': css`
        background: linear-gradient(145deg,rgba(26, 30, 36, 0.5) 0%,rgba(19, 22, 26, 0.5) 100%);
        padding: 20px !important;
        line-height: 1.8 !important;
        color: #8c95a3;
        position: relative;
    `,
    'info-modal-header': css`
        border-bottom: 1px solid rgba(94, 129, 244, 0.3) !important;
        padding: 16px !important;
        background: #1a1e24 !important;
        border-radius: 8px 8px 0 0 !important;
        .ant-modal-title {
            color: #5e81f4;
            font-weight: 600;
            font-size: 18px;
            text-shadow: 0 2px 4px rgba(94, 129, 244, 0.15);
        }
    `,
    'info-modal-footer': css`
        border-top: 1px solid rgba(94, 129, 244, 0.3) !important;
        padding: 12px 16px !important;
        background: #1a1e24 !important;
        display: flex !important;
        justify-content: flex-end !important;
        gap: 8px;
        border-radius: 0 0 8px 8px !important;
        
        .ant-btn {
            transition: all 0.2s ease-in-out !important;
            border: 1px solid transparent !important;
            min-width: 80px !important;
            
            &:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 12px rgba(94, 129, 244, 0.25) !important;
            }
        }
        
        .ant-btn-primary {
            background: linear-gradient(135deg, #5e81f4 0%, #3b5bdb 100%);
            border: none !important;
            &:hover {
                background: linear-gradient(135deg, #3b5bdb 0%, #5e81f4 100%) !important;
            }
        }
        
        .ant-btn-default {
            background: rgba(94, 129, 244, 0.1);
            border-color: rgba(94, 129, 244, 0.3);
            color: #8c95a3;
            &:hover {
                color: #ffffff !important;
                border-color: #5e81f4;
                background: rgba(94, 129, 244, 0.1) !important;
            }
        }
    `,
    'info-modal-content': css`
        border: 1px solid rgba(94, 129, 244, 0.3) !important;
        border-radius: 8px !important;
        box-shadow: 
            0 12px 24px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
        background-color: #1a1e24 !important;
        overflow: hidden;
        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(
                circle at 75% 20%,
                rgba(94, 129, 244, 0.15) 0%,
                transparent 60%
            );
            pointer-events: none;
        }

        .ant-modal-close {
            color: #d3d9e4 !important;

            &:hover {
                background-color:rgba(206, 206, 206, 0.23) !important;
            }
        }
    `,
    infoItem: css`
        display: flex;
        margin-bottom: 12px;
        padding: 8px;
        border-radius: 4px;
        transition: background 0.2s;
        position: relative;

        &:hover {
            background: rgba(94, 129, 244, 0.05);
            &::before {
                transform: scale(1.2);
            }
        }
        
        &::before {
            content: '•';
            color: #5e81f4;
            margin-right: 8px;
            font-weight: bold;
            transition: transform 0.2s;
        }
        
        .ant-form-item-row {
            width: 100%;
        }

        .ant-form-item-label label {
            color: #d3d9e4;
        }
    `,
    input: css`
        &::placeholder {
            color:rgba(207, 215, 227, 0.39);
        }
    `
}));
const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onCancel, onOk, id }) => {
    const { styles } = useStyle();

    const classNames = {
        body: styles['info-modal-body'],
        header: styles['info-modal-header'],
        footer: styles['info-modal-footer'],
        content: styles['info-modal-content'],
    };

    // 文件类型验证
    const beforeUpload: UploadProps['beforeUpload'] = (file) => {
        const isAllowedType = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ].includes(file.type);

        if (!isAllowedType) {
            message.error('仅支持上传 PDF 和 DOC 文件!');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    // 自定义上传处理
    const customRequest: UploadProps['customRequest'] = async (options) => {
        const { file, onProgress, onSuccess, onError } = options;

        try {
            // 模拟上传进度
            onProgress?.({ percent: 0 });

            // 调用上传接口
            const res = await uploadFileAPI(id, file as File);

            onProgress?.({ percent: 100 });
            onSuccess?.(res, file);
            message.success(`${(file as File).name} 上传成功`);
        } catch (err) {
            onError?.(err as Error | ProgressEvent<EventTarget>);
            message.error(`${(file as File).name} 上传失败`);
        }
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onCancel}
            onOk={onOk}
            classNames={classNames}
            okText="确认"
            cancelText="取消"
            width={800}
        >
            <Upload.Dragger
                name="file"
                multiple={true}
                accept=".pdf,.doc,.docx"
                beforeUpload={beforeUpload}
                customRequest={customRequest}
                onChange={(info) => {
                    // 保留基础状态处理
                    const { status } = info.file;
                    if (status === 'error') {
                        message.error(`${info.file.name} 文件上传失败`);
                    }
                }}
                style={{
                    padding: '20px',
                    height: '200px',
                    margin: '0 auto',
                    color: 'white'
                }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text" style={{ color: 'white' }}>
                    点击或拖拽文件到此处上传
                </p>
                <p className="ant-upload-hint" style={{ color: 'rgba(159, 177, 238, 0.38)' }}>
                    仅支持 PDF 和 DOC 格式文件，严禁上传敏感数据
                </p>
            </Upload.Dragger>
        </Modal>
    );
};

export default UploadModal
