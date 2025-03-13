import { useState, useRef, useEffect } from 'react';
import { Space, Divider, Tooltip, Button } from 'antd';
import {
  AudioOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  EditOutlined,
} from '@ant-design/icons';

interface AudioRecorderProps {
  onEdit: () => void;
}

const AudioRecorder = ({onEdit}: AudioRecorderProps) => {
  // 状态管理
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // 处理录音时间
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordTime(t => t + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, isPaused]);

  // 开始录音
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    
    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };
    
    mediaRecorder.current.start();
    setIsRecording(true);
  };

  // 暂停/继续录音
  const togglePause = () => {
    if (!mediaRecorder.current) return;
    
    if (isPaused) {
      mediaRecorder.current.resume();
    } else {
      mediaRecorder.current.pause();
    }
    setIsPaused(!isPaused);
  };

  // 停止录音
  const stopRecording = () => {
    if (!mediaRecorder.current) return;
    
    mediaRecorder.current.stop();
    mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    
    setIsRecording(false);
    setIsPaused(false);
    setRecordTime(0);
  };

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 24px',
      background: '#f5f5f5',
      borderRadius: 8,
      width: '100%',
      maxWidth: 600,
    }}>
      {/* 左侧录音状态 */}
      <Space size={16}>
        <AudioOutlined style={{ color: isRecording ? '#ff4d4f' : '#999' }} />
        
        {/* 进度条 */}
        <div style={{
          width: 60,
          height: 2,
          background: '#ddd',
          position: 'relative',
        }}>
          <div style={{
            width: `${(recordTime % 60) * (100 / 60)}%`,
            height: '100%',
            background: '#ff4d4f',
            transition: 'width 0.3s',
          }} />
        </div>
        
        {/* 录音时间 */}
        <span style={{ color: '#666' }}>{formatTime(recordTime)}</span>
      </Space>

      <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />

      {/* 操作按钮 */}
      <Space size={8}>
        {!isRecording ? (
          <Tooltip title="开始录音">
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={startRecording}
            />
          </Tooltip>
        ) : (
          <>
            <Tooltip title={isPaused ? '继续录音' : '暂停录音'}>
              <Button
                type="text"
                icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                onClick={togglePause}
              />
            </Tooltip>
            <Tooltip title="停止录音">
              <Button
                type="text"
                icon={<StopOutlined />}
                onClick={stopRecording}
              />
            </Tooltip>
          </>
        )}

        <Tooltip title="切换到文字编辑模式">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={onEdit}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default AudioRecorder;