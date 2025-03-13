// SpeechRecognition.tsx
import { useState, useEffect } from 'react';

// 类型声明（放在全局声明文件如 global.d.ts 中更合适）
declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

interface SpeechRecognitionProps {
    onResult: (transcript: string) => void;
}

interface SpeechRecognitionEvent extends Event {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
                confidence: number;
            };
        };
        isFinal: boolean;
    }[];
}

interface Window {
    webkitSpeechRecognition: {
        new(): {
            continuous: boolean;
            interimResults: boolean;
            lang: string;
            onstart: () => void;
            onend: () => void;
            onresult: (event: SpeechRecognitionEvent) => void;
            onerror: (event: Event) => void;
            start: () => void;
            stop: () => void;
        };
    };
}

const SpeechRecognition = ({ onResult }: SpeechRecognitionProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        // 初始化语音识别
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'zh-CN'; // 设置中文识别，可以根据需要修改

            recognition.onstart = () => {
                setIsRecording(true);
                setError(null);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result) => result.transcript)
                    .join('');
                onResult(transcript);
            };

            recognition.onerror = (event: any) => {
                setError(`语音识别错误: ${event.error}`);
                setIsRecording(false);
            };

            setRecognition(recognition);
        } else {
            setError('您的浏览器不支持语音识别功能，请使用最新版Chrome浏览器');
        }
    }, [onResult]);

    const toggleRecording = () => {
        if (recognition) {
            if (!isRecording) {
                recognition.start();
            } else {
                recognition.stop();
            }
        }
    };

    return (
        <div className="speech-recognition">
            <button
                onClick={toggleRecording}
                style={{ backgroundColor: isRecording ? '#ff4444' : '#4CAF50' }}
            >
                {isRecording ? '停止录音' : '开始录音'}
            </button>

            {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

            <div style={{ marginTop: 10 }}>
                浏览器支持状态: {('webkitSpeechRecognition' in window) ? '✅' : '❌'}
            </div>
        </div>
    );
};

export default SpeechRecognition;