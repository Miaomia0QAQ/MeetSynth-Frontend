import { Avatar, message } from 'antd';
import { DeleteOutlined, EditOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import AudioRecorder from './AudioRecorder/AudioRecorder';
import RecorderInput from './RecorderInput/RecorderInput';
import './SpeechTranscriber.css';
import { hex_md5 } from '../../../utils/md5';
import CryptoJS from 'crypto-js';
import { TranscriptItem } from '../MeetingLayout';
import { saveTranscriptAPI } from '../../../apis/meeting';

type TranscribeStatus = 'UNDEFINED' | 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

const appId = '12779e92';
const secretKey = 'f9f356c94a4743faf5a91845e29937e6';

interface SpeechTranscriberProps {
    id: string;
    title: string;
    hasContent: boolean;
    transcripts: TranscriptItem[];
    recorderState: 'record' | 'edit';
    editingContent: string;
    onRecord: () => void;
    onTranscriptEdit: () => void;
    onTranscriptAdd: (transcript: string) => void;
    setEditingContent: (content: string) => void;
    handleEdit: (id: number) => void;
    handleEditSubmit: (id: number) => void;
    handleEditKeyDown: (id: number, e: React.KeyboardEvent) => void;
    handleDelete: (id: number) => void;
    onTranscriptUpdate: (index: number, transcript: string) => void;
}

const SpeechTranscriber = ({
    id,
    title,
    hasContent,
    transcripts,
    onTranscriptUpdate,
    recorderState,
    editingContent,
    onRecord,
    onTranscriptEdit,
    onTranscriptAdd,
    setEditingContent,
    handleEdit,
    handleEditSubmit,
    handleEditKeyDown,
    handleDelete,
}: SpeechTranscriberProps) => {
    const [status, setStatus] = useState<TranscribeStatus>('UNDEFINED');
    // const [resultText, setResultText] = useState('');
    const [resultTextTemp, setResultTextTemp] = useState('');

    // 录音组件实例
    const recorderRef = useRef<any>(null);
    // websocket实例
    const iatWSRef = useRef<WebSocket | null>(null);

    // 初始化录音组件和websocket实例
    useEffect(() => {
        recorderRef.current = new window.RecorderManager('../../dist');
        const recorder = recorderRef.current;
        recorder.onStart = () => setStatus('OPEN');

        // 录音发送数据
        recorder.onFrameRecorded = ({ isLastFrame, frameBuffer }: any) => {
            if (iatWSRef.current?.readyState === WebSocket.OPEN) {
                iatWSRef.current.send(new Int8Array(frameBuffer));
                // 如果是最后一帧，发送结束标志
                if (isLastFrame) {
                    iatWSRef.current.send('{"end": true}');
                    setStatus('CLOSING');
                }
            }
        };

        return () => {
            recorder.stop();
            iatWSRef.current?.close();
        };
    }, []);

    // 连接websocket
    const connectWebSocket = () => {
        const wsUrl = getWebSocketUrl();
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            setStatus('OPEN');
            recorderRef.current?.start({
                sampleRate: 16000,
                frameSize: 1280
            });
        };

        ws.onmessage = (e) => handleWebSocketMessage(e.data);

        ws.onerror = (e) => {
            console.error(e);
            recorderRef.current?.stop();
            setStatus('CLOSED');
        };

        ws.onclose = () => {
            recorderRef.current?.stop();
            setStatus('CLOSED');
        };

        iatWSRef.current = ws;
        setStatus('CONNECTING');
    };

    // 处理websocket消息
    const handleWebSocketMessage = (data: string) => {
        const jsonData = JSON.parse(data);

        if (jsonData.action === "result") {
            const result = JSON.parse(jsonData.data);
            let temp = '';

            result.cn.st.rt.forEach((j: any) => {
                j.ws.forEach((k: any) => {
                    k.cw.forEach((l: any) => temp += l.w);
                });
            });

            if (result.cn.st.type === '0') {
                onTranscriptUpdate(0, temp)
                setResultTextTemp('');
            } else {
                setResultTextTemp(temp);
            }
        } else if (jsonData.action === "error") {
            console.error("转写错误:", jsonData);
        }
    };

    // 获取websocket连接地址
    const getWebSocketUrl = () => {
        const ts = Math.floor(Date.now() / 1000);
        const signa = hex_md5(appId + ts);
        const signatureSha = CryptoJS.HmacSHA1(signa, secretKey);
        const signature = CryptoJS.enc.Base64.stringify(signatureSha);
        return `wss://rtasr.xfyun.cn/v1/ws?appid=${appId}&ts=${ts}&signa=${encodeURIComponent(signature)}`;
    };

    // 处理控制按钮的点击事件
    const handleControlClick = () => {
        if (status === 'UNDEFINED' || status === 'CLOSED') {
            connectWebSocket();
        } else if (['CONNECTING', 'OPEN'].includes(status)) {
            recorderRef.current?.stop();
        }
    };

    // 保存录音转译原文
    // const saveTranscript = () => {
    //     if (transcripts.length > 0) {
    //         let result = '';
    //         transcripts.forEach((item) => {
    //             if (item.text) {
    //                 result += `${item.text}\n`
    //             }
    //         });
    //         if (result !== '') {
    //             saveTranscriptAPI(id, result).then(res => {
    //                 if (res.code === 1) {
    //                 } else {
    //                     message.error(res.msg || '录音保存失败');
    //                 }
    //             }).catch(err => {
    //                 message.error('录音保存失败，请检查网络');
    //                 console.log(err);
    //             })
    //         }
    //     }
    // };

    return (
        <div className={`left-panel ${hasContent ? 'has-content' : ''}`}>
            <h1 className='meeting-title'>
                {title}
            </h1>

            <div className="content-wrapper">
                {!hasContent &&
                    <div className={`empty-state ${hasContent ? 'fade-out' : ''}`}>
                        <p className="tip-text">点击下方按钮开始录音，实时转写会议内容</p>
                    </div>
                }

                {hasContent && (
                    <div className="transcript-container">
                        {transcripts.map((item, index) => (
                            <div key={index} className='message-container'>
                                <Avatar
                                    icon={<UserOutlined />}
                                    style={{
                                        flexShrink: 0,
                                        backgroundColor: '#c4c4c4',
                                        margin: '5px 8px 0 0'
                                    }}
                                />
                                <div className="transcript-item">
                                    {item.editable ? (
                                        <>
                                            <textarea
                                                className="edit-textarea"
                                                value={editingContent}
                                                onChange={(e) => setEditingContent(e.target.value)}
                                                onKeyDown={(e) => handleEditKeyDown(index, e)}
                                                autoFocus
                                            />
                                            <SendOutlined
                                                onClick={() => handleEditSubmit(index)}
                                                className="submit-icon"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <span className="text">{item.text}</span>
                                            <span className='text'>{resultTextTemp}</span>
                                            <div className="action-buttons">
                                                <EditOutlined onClick={() => handleEdit(index)} className="edit-icon" />
                                                <DeleteOutlined onClick={() => handleDelete(index)} className="delete-icon" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {recorderState === 'record' ? (
                <div className="recording-control">
                    <AudioRecorder onEdit={onTranscriptEdit} handleControlClick={handleControlClick} />
                </div>
            ) : (
                <RecorderInput
                    onRecord={onRecord}
                    onTranscriptAdd={onTranscriptAdd}
                />
            )}
        </div>
    );
};

export default SpeechTranscriber;