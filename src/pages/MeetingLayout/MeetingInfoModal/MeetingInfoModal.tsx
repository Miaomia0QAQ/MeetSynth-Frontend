import React from 'react';
import { createStyles } from 'antd-style';
import { Form, Input, Modal } from 'antd';

interface MeetingInfoModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onOk: () => void;
}

const useStyle = createStyles(({ css }) => ({
    'info-modal-body': css`
        background: linear-gradient(145deg,rgba(26, 30, 36, 0.5) 0%,rgba(19, 22, 26, 0.5) 100%);
        padding: 20px !important;
        line-height: 1.8 !important;
        color: #8c95a3;
        position: relative;
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

const MeetingInfoModal: React.FC<MeetingInfoModalProps> = ({ isOpen, onCancel, onOk }) => {
    // 表单提交 loading 状态
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const { styles } = useStyle();
    // 创建表单实例
    const [form] = Form.useForm();

    const classNames = {
        body: styles['info-modal-body'],
        header: styles['info-modal-header'],
        footer: styles['info-modal-footer'],
        content: styles['info-modal-content'],
    };

    const modalStyle = {
        maxWidth: '520px',
        width: '800px',
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                form.resetFields();
                setConfirmLoading(true);
                // 进行数据处理
                setTimeout(()=>{
                    console.log('Received values of form: ', values);
                    setConfirmLoading(false);
                    onOk(); // 将表单值传递给外部处理
                }, 2000)
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    return (
        <Modal
            title="会议信息"
            open={isOpen}
            onCancel={onCancel}
            onOk={handleSubmit}
            classNames={classNames}
            style={modalStyle}
            okText="确认"
            cancelText="取消"
            confirmLoading={confirmLoading}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    // 可以设置初始值
                }}
            >
                <Form.Item
                    name="title"
                    label="会议标题"
                    className={styles.infoItem}
                >
                    <Input
                        placeholder="请输入会议标题"
                        style={{
                            background: 'rgba(22, 26, 32, 0.8)',
                            border: '1px solid #2a2f38',
                            color: '#c8d3e6',
                            borderRadius: '6px'
                        }}
                        className={styles.input}
                    />
                </Form.Item>

                <Form.Item
                    name="participants"
                    label="参会人员"
                    className={styles.infoItem}
                >
                    <Input
                        type='text'
                        placeholder="张三, 李四, 王五"
                        style={{
                            background: 'rgba(22, 26, 32, 0.8)',
                            border: '1px solid #2a2f38',
                            color: '#c8d3e6',
                            borderRadius: '6px'
                        }}
                        className={styles.input}
                    />
                </Form.Item>

                <Form.Item
                    name="leader"
                    label="会议负责人"
                    className={styles.infoItem}
                >
                    <Input
                        type='text'
                        style={{
                            background: 'rgba(22, 26, 32, 0.8)',
                            border: '1px solid #2a2f38',
                            color: '#c8d3e6',
                            borderRadius: '6px'
                        }}
                        placeholder='请输入会议负责人'
                        className={styles.input}
                    />
                </Form.Item>

                <Form.Item
                    name="startTime"
                    label="开始时间"
                    className={styles.infoItem}
                >
                    <Input
                        type='datetime-local'
                        style={{
                            background: 'rgba(22, 26, 32, 0.8)',
                            border: '1px solid #2a2f38',
                            color: '#c8d3e6',
                            borderRadius: '6px'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="会议描述"
                    className={styles.infoItem}
                >
                    <Input.TextArea
                        rows={3}
                        style={{
                            background: 'rgba(22, 26, 32, 0.8)',
                            border: '1px solid #2a2f38',
                            color: '#c8d3e6',
                            borderRadius: '6px'
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MeetingInfoModal;