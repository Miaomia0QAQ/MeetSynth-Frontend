import { useEffect, useRef, useState } from 'react';
import SpeechToText from './SpeechToText/SpeechToText';
import { HomeFilled, LeftCircleOutlined } from '@ant-design/icons';
import './MeetingLayout.css';
import { Button, message } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import AISummary, { AISummaryRef } from './AISummary/AISummary';
import { DeepseekIcon } from '../../component/Icons';
import Sidebar from './Siderbar/Siderbar';

const MeetingLayout = () => {
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('新会议');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [finalText, setFinalText] = useState<string>('');
  const [editabled, setEditabled] = useState<boolean>(false);
  const summaryRef = useRef<AISummaryRef>(null)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const onToggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  }

  // AI总结事件
  const handleSummarize = () => {
    summaryRef.current?.sendRequest(finalText)
  }

  // 处理文本内容修改
  const handleContentChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || '';
    setFinalText(newText);
  };

  const onTranscriptUpdate = (content: string) => {
    setTranscript(content);
  };

  const onStopRecording = () => {
    setFinalText(prev => prev + transcript);
    setTranscript('');
  };

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return (
    <div className="meeting-background">
      <div className="meeting-container">
        <div className="main-container">
          {/* 顶部标题栏 */}
          <header className="header">
            <div className="logo">
              <HomeFilled style={{ fontSize: '30px', color: '#A3AAF2' }} />
            </div>
            <div className="header-content">
              <div className="date-box">2024/03/02</div>
              <h1 className="title">{title}</h1>
            </div>
            <div className="menu-button" onClick={onToggleSidebar}>
              <LeftCircleOutlined style={{ fontSize: '36px', color: '#A3AAF2' }} />
            </div>
          </header>

          <main className="main-content">
            <div className="left-panel">
              <div className="text-container">
                <h2 className="text-title">原文：</h2>
                {/* 可编辑文本区域 */}
                {editabled ? (
                  <div
                    className="text-content editable"
                    contentEditable
                    onBlur={handleContentChange}
                    suppressContentEditableWarning
                  >
                    {finalText}
                  </div>
                ) : (
                  <div className="text-content">
                    {finalText + transcript || "点击下方开始录音，内容将显示在此处"}
                  </div>
                )}
              </div>

              <div className="recording-control">
                <SpeechToText
                  onTranscriptUpdate={onTranscriptUpdate}
                  onTranscriptError={setError}
                  onStopRecording={onStopRecording}
                  onTranscriptEdit={() => setEditabled(prev => !prev)}
                  onTranscriptClear={() => setFinalText('')}
                />
              </div>
            </div>

            <div className="right-panel" >
              <div className='summary-header'>
                <div className="icon-box">
                  <DeepseekIcon />
                </div>
                <Button type='primary' onClick={handleSummarize}>生成总结</Button>
              </div>
              <AISummary ref={summaryRef} />
            </div>
          </main>
        </div>

        {/* 侧边栏菜单 */}
        <Sidebar isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default MeetingLayout;