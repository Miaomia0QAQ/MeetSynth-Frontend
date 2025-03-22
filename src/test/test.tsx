import React, { useState, useRef, useEffect } from 'react';
import { hex_md5 } from '../utils/md5';
import CryptoJS from 'crypto-js';

type TranscribeStatus = 'UNDEFINED' | 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

interface SpeechTranscriberProps {
    appId: string;
    secretKey: string;
}

const Test: React.FC<SpeechTranscriberProps> = ({ appId, secretKey }) => {
    const [status, setStatus] = useState<TranscribeStatus>('UNDEFINED');
    const [resultText, setResultText] = useState('');
    const [resultTextTemp, setResultTextTemp] = useState('');

    const recorderRef = useRef<any>(null);
    const iatWSRef = useRef<WebSocket | null>(null);
    let countdownIntervalRef;

    useEffect(() => {
        recorderRef.current = new window.RecorderManager('../../dist')

        const recorder = recorderRef.current;
        recorder.onStart = () => setStatus('OPEN');
        recorder.onStop = () => clearInterval(countdownIntervalRef);

        recorder.onFrameRecorded = ({ isLastFrame, frameBuffer }: any) => {
            if (iatWSRef.current?.readyState === WebSocket.OPEN) {
                iatWSRef.current.send(new Int8Array(frameBuffer));
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

    const getWebSocketUrl = () => {
        const ts = Math.floor(Date.now() / 1000);
        const signa = hex_md5(appId + ts);
        const signatureSha = CryptoJS.HmacSHA1(signa, secretKey);
        const signature = CryptoJS.enc.Base64.stringify(signatureSha);
        return `wss://rtasr.xfyun.cn/v1/ws?appid=${appId}&ts=${ts}&signa=${encodeURIComponent(signature)}`;
    };

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

            if (result.cn.st.type === 0) {
                setResultText(prev => prev + resultTextTemp);
                console.log('resultText:', resultText);
                setResultTextTemp('');
            } else {
                setResultTextTemp(prev => prev + temp);
            }
        } else if (jsonData.action === "error") {
            console.error("转写错误:", jsonData);
        }
    };

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

    const handleControlClick = () => {
        if (status === 'UNDEFINED' || status === 'CLOSED') {
            connectWebSocket();
        } else if (['CONNECTING', 'OPEN'].includes(status)) {
            recorderRef.current?.stop();
        }
    };

    const buttonText = {
        UNDEFINED: '开始录音',
        CONNECTING: '建立连接中',
        OPEN: '录音中',
        CLOSING: '关闭连接中',
        CLOSED: '开始录音'
    }[status];

    return (
        <div>
            <button
                onClick={handleControlClick}
                disabled={status === 'CONNECTING' || status === 'CLOSING'}
            >
                {buttonText}
            </button>
            <div>
                <span style={{ color: '#666' }}>{resultText}</span>
                <span style={{ color: '#666' }}>{resultTextTemp}</span>
            </div>
        </div>
    );
};

export default Test;