import React, { useState } from 'react';
import styles from './RecorderInput.module.css';
import { ArrowUpOutlined, AudioFilled } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

interface RecorderInputProps {
    onRecord: () => void;
    onTranscriptAdd: (transcript: string) => void;
}

const RecorderInput: React.FC<RecorderInputProps> = ({ onRecord, onTranscriptAdd }) => {
    const [message, setMessage] = useState('');
    // const { setIsEdit } = useContext(isEditContext);

    const handleSubmit = () => {
        if (message.trim() !== '') {
            onTranscriptAdd(message);
            setMessage('');
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={styles.container}>
            {/* 输入区域 */}
            <div className={styles.inputContainer}>
                <textarea
                    className={styles.input}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="生成结果不满意？给 AI 提点意见吧"
                    rows={1}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
            </div>

            {/* 底部状态栏 */}
            <div className={styles.footer}>
                <Tooltip title="录音">
                    <Button
                        type="text"
                        shape="circle"
                        icon={<AudioFilled style={{ fontSize: '18px' }} />}
                        style={{ border: 'none', backgroundColor: 'transparent', marginRight: '20px' }}
                        className={styles.footerButton}
                        onClick={() => onRecord()}
                    />
                </Tooltip>
                <button
                    className={`${styles.sendButton} ${message ? styles.active : ''}`}
                    disabled={!message}
                    onClick={handleSubmit}
                >
                    <ArrowUpOutlined />
                </button>
            </div>
        </div>
    );
};

export default RecorderInput;