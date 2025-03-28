import React, { useContext } from 'react';
import styles from './AiChatInput.module.css';
import { ArrowUpOutlined, DownloadOutlined, EditFilled } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { isEditContext } from '../../isEditContext';

interface AIChatInputProps {
    onExportPdf: () => void;
}

const AIChatInput: React.FC<AIChatInputProps> = ({ onExportPdf }) => {
    const { feedback, setFeedback, setIsEdit, handleSendRequest } = useContext(isEditContext);

    const handleSumbit = () => {
        if (feedback) {
            handleSendRequest();
            setFeedback('');
        }
    };

    return (
        <div className={styles.background}>
            <div className={styles.container}>
                {/* 输入区域 */}
                <div className={styles.inputContainer}>
                    <textarea
                        className={styles.input}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="生成结果不满意？给 AI 提点意见吧"
                        rows={1}
                    />
                </div>

                {/* 底部状态栏 */}
                <div className={styles.footer}>
                    <Tooltip title="导出">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<DownloadOutlined style={{ fontSize: '20px' }} />}
                            style={{ border: 'none', backgroundColor: 'transparent', marginRight: '5px' }}
                            className={styles.footerButton}
                            onClick={onExportPdf}
                        />
                    </Tooltip>
                    <Tooltip title="编辑">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<EditFilled style={{ fontSize: '18px' }} />}
                            style={{ border: 'none', backgroundColor: 'transparent', marginRight: '20px' }}
                            className={styles.footerButton}
                            onClick={() => setIsEdit(true)}
                        />
                    </Tooltip>
                    <button
                        className={`${styles.sendButton} ${feedback ? styles.active : ''}`}
                        disabled={!feedback}
                        onClick={handleSumbit}
                    >
                        <ArrowUpOutlined />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatInput;