import { useState, useEffect } from 'react';
import './SpeechToText.css';
import { AudioFilled, PauseCircleOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';

// 定义语音识别结果类型
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

// 扩展Window接口以支持webkit类型
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface SpeechToTextProps {
  onTranscriptUpdate: (text: string) => void;
  onTranscriptError: (error: string) => void;
  onStopRecording: () => void;
  onTranscriptEdit: () => void;
  onTranscriptClear: () => void;
}

const SpeechToText = ({ onTranscriptUpdate, onTranscriptError, onStopRecording, onTranscriptEdit, onTranscriptClear }: SpeechToTextProps) => {
  // 状态管理
  const [isRecording, setIsRecording] = useState(false);
  const [isEdting, setIsEditing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showRecordTooltip, setShowRecordTooltip] = useState(false);
  const [showEditTooltip, setShowEditTooltip] = useState(false);
  const [showClearTooltip, setShowClearTooltip] = useState(false);

  useEffect(() => {
    // 初始化语音识别
    const SpeechRecognition = window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      ('浏览器不支持语音识别功能，请使用Chrome浏览器');
      return;
    }

    const recognition = new SpeechRecognition();
    setRecognition(recognition);

    // 配置识别参数
    recognition.continuous = true;  // 持续录音
    recognition.interimResults = true;  // 获取临时结果
    recognition.lang = 'zh-CN';  // 中文普通话

    // 更新识别结果处理
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      onTranscriptUpdate(transcript);
    };

    recognition.onerror = (event: Event) => {
      console.error('语音识别错误:', event);
      onTranscriptError('语音识别出错，请检查麦克风权限');
      setIsRecording(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // 开始/停止录音
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      recognition?.stop();
      onStopRecording();
    } else {
      if (!isEdting) {
        setIsRecording(true);
        recognition?.start();
      }
    }
  };

  // 编辑文本
  const handleEdit = () => {
    if (!isEdting && !isRecording) {
      setIsEditing(true);
      onTranscriptEdit();
    } else if (isEdting) {
      setIsEditing(false);
      onTranscriptEdit();
    }
  }

  // 清空文本
  const handleClear = () => {
    if (!isRecording) {
      onTranscriptClear();
    }
  }

  return (
    <div className="control-container">

      {/* 录制开关 */}
      <div
        className="tooltip-wrapper"
        onMouseEnter={() => setShowRecordTooltip(true)}
        onMouseLeave={() => setShowRecordTooltip(false)}
      >
        <button
          onClick={toggleRecording}
          className={`control-button ${isRecording ? 'recording' : ''}`}
          style={{ cursor: isEdting ? 'auto' : 'pointer' }}
        >
          {isRecording ? <PauseCircleOutlined style={{ fontSize: '20px' }} /> : <AudioFilled style={{ fontSize: '20px', color: isEdting ? 'rgb(198,198,198)' : 'black' }} />}
        </button>
        {showRecordTooltip && (
          <div className="tooltip">
            {isRecording ? '停止录制' : '开始录制'}
          </div>
        )}
      </div>

      {/* 编辑开关 */}
      <div
        className="tooltip-wrapper"
        onMouseEnter={() => setShowEditTooltip(true)}
        onMouseLeave={() => setShowEditTooltip(false)}
      >
        <button
          className="control-button"
          onClick={handleEdit}
          style={{ cursor: isRecording ? 'auto' : 'pointer' }}
        >
          <EditFilled style={{ fontSize: '20px', color: isRecording ? 'rgb(198,198,198)' : 'black' }} />
        </button>
        {showEditTooltip && (
          <div className="tooltip">编辑</div>
        )}
      </div>

      <div
        className="tooltip-wrapper"
        onMouseEnter={() => setShowClearTooltip(true)}
        onMouseLeave={() => setShowClearTooltip(false)}
      >
        <button
          className="control-button"
          onClick={handleClear}
          style={{ cursor: isRecording ? 'auto' : 'pointer' }}
        >
          <DeleteFilled style={{ fontSize: '20px', color: isRecording ? 'rgb(198,198,198)' : 'black' }} />
        </button>
        {showClearTooltip && (
          <div className="tooltip">清空</div>
        )}
      </div>
    </div>
  );
};

export default SpeechToText;