import { use, useEffect, useRef, useState } from 'react';
import { HomeFilled, LeftCircleOutlined } from '@ant-design/icons';
import './MeetingLayout.css';
import { Splitter } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import AISummary, { AISummaryRef } from './AISummary/AISummary';
import Sidebar from './Siderbar/Siderbar';
import MeetingInfoModal from './MeetingInfoModal/MeetingInfoModal';
import UploadModal from './UploadModal/UploadModal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SpeechTranscriber from './SpeechTranscriber/SpeechTranscriber';
import { getMeetingAPI } from '../../apis/meeting';
import { meetingInfo } from '../../types/meetingInfo';

export interface TranscriptItem {
  text: string;
  editable: boolean;
}
const MeetingLayout = () => {
  const [searchParams] = useSearchParams();
  // 会议id
  const id = searchParams.get('id') || '';
  // 会议标题
  const [info, setInfo] = useState<meetingInfo>({});
  // 会议内容是否存在
  const [hasContent, setHasContent] = useState<boolean>(false);
  // 录音转文字内容
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  // 用户编辑内容
  const [editingContent, setEditingContent] = useState('');
  // 左右版块大小
  const [panelSize, setPanelSize] = useState<(number | string)[]>(['100%', '0%']);
  const [recorderState, setRecorderState] = useState<'record' | 'edit'>('record');
  /*
   下面是模态框相关状态
  */
  // 信息模态框开关状态
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  // 上传模态框开关状态
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const summaryRef = useRef<AISummaryRef>(null);
  const navigate = useNavigate();

  // AI总结事件
  const handleSummarize = () => {
    if (panelSize[1] === '0%' || panelSize[1] === 0 || panelSize[1] === '0') {
      summaryRef.current?.sendRequest(transcripts.map(item => item.text).join('\n'))
      setPanelSize(['50%', '50%']);
    }
  }

  // 处理编辑内容
  const onTranscriptEdit = () => {
    setHasContent(true);
    setRecorderState('edit');
  };

  // 处理转写内容添加事件
  const onTranscriptAdd = (transcript: string) => {
    setTranscripts(prev => [...prev, { id: String(Date.now()), text: transcript, editable: false }])
  }

  const onTranscriptUpdate = (i: number, transcript: string) => {
    setTranscripts(prev => {
      // 数组为空时创建新元素
      if (prev.length === 0) {
        return [{ text: transcript, editable: false }];
      }
      // 数组有元素时更新第一个元素的text
      return prev.map((item, index) =>
        index === i
          ? { ...item, text: item.text + transcript }
          : item
      );
    });
  }

  const onStopRecording = () => {

  };

  // 处理可编辑事件
  const handleEdit = (index: number) => {
    setEditingContent(transcripts[index].text || '')
    setTranscripts(prev => prev.map((item, i) => i === index ? { ...item, editable: true } : item))
  }

  // 处理编辑提交事件
  const handleEditSubmit = (index: number) => {
    setTranscripts(prev => prev.map((item, i) => i === index ? { ...item, text: editingContent, editable: false } : item))
    setEditingContent('')
    console.log(666)
  }

  // 处理编辑状态时的回车事件（提交）
  const handleEditKeyDown = (index: number, e: any) => {
    if (e.keyCode === 13) {
      handleEditSubmit(index)
    }
  }
  // 删除录音内容
  const handleDelete = (index: number) => {
    setTranscripts(prev => prev.filter((_, i) => i !== index));
  }

  // 获取当前日期
  const getDate = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }

  /*
    下面是模态框的事件处理函数
  */
  // 处理信息模态框的打开事件
  const handleInfoModalOpen = () => {
    setIsInfoModalOpen(true);
  }

  // 处理信息模态框的关闭事件
  const handleInfoModalCancel = () => {
    setIsInfoModalOpen(false);
  }

  // 处理信息模态框的提交事件
  const handleInfoModalOk = () => {
    setIsInfoModalOpen(false);
  }

  // 处理上传模态框的打开事件
  const handleUploadModalOpen = () => {
    setIsUploadModalOpen(true);
  }

  // 处理上传模态框的关闭事件
  const handleUploadModalCancel = () => {
    setIsUploadModalOpen(false);
  }

  // 处理上传模态框的提交事件
  const handleUploadModalOk = () => {
    setIsUploadModalOpen(false);
  }

  useEffect(() => {
    if (id && id !== '') {
      getMeetingAPI(id).then(res => {
        if (res.code === 1) {
          const { title, description, startTime, participants, leader, recording } = res.data;
          setInfo({ title, description, startTime, participants, leader });
          setTranscripts([{ text: recording, editable: false }]);
        }
      })
    }
  }, [])

  useEffect(() => {
    if (transcripts.length > 0) {
      setHasContent(true);
    }
  }, [transcripts])

  // 渲染
  return (
    <div className="meeting-background">
      <div className="meeting-container">
        <div className="main-container">
          {/* 顶部标题栏 */}
          <header className="header">
            <div className="logo" onClick={() => navigate('/')}>
              <HomeFilled style={{ fontSize: '30px', color: '#A3AAF2' }} />
            </div>
            <div className="header-content">
              <div className="date-box">2024/03/02</div>
            </div>
            <div className="menu-button">
              <LeftCircleOutlined style={{ fontSize: '36px', color: '#A3AAF2' }} />
            </div>
          </header>

          {/* 主要内容 */}
          <Splitter
            className="main-content"
            lazy
            onResize={setPanelSize}
          >
            <Splitter.Panel className="left-panel-wrapper" size={panelSize[0]}>
              <SpeechTranscriber
                title={info.title ? info.title : `${getDate()}会议`}
                hasContent={hasContent}
                transcripts={transcripts}
                recorderState={recorderState}
                editingContent={editingContent}
                onRecord={() => setRecorderState('record')}
                onTranscriptEdit={onTranscriptEdit}
                onTranscriptAdd={onTranscriptAdd}
                onTranscriptUpdate={onTranscriptUpdate}
                setEditingContent={setEditingContent}
                handleEdit={handleEdit}
                handleEditSubmit={handleEditSubmit}
                handleEditKeyDown={handleEditKeyDown}
                handleDelete={handleDelete}
              />
            </Splitter.Panel>

            <Splitter.Panel className="right-panel" collapsible={true} size={panelSize[1]}>
              <AISummary ref={summaryRef} />
            </Splitter.Panel>

          </Splitter>
        </div >

        {/* 侧边栏菜单 */}
        <Sidebar
          handleSummarize={handleSummarize}
          handleInfoModalOpen={handleInfoModalOpen}
          handleUploadModalOpen={handleUploadModalOpen}
        />
      </div >

      {/* 会议信息模态框 */}
      <MeetingInfoModal
        isOpen={isInfoModalOpen}
        onCancel={handleInfoModalCancel}
        onOk={handleInfoModalOk}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onCancel={handleUploadModalCancel}
        onOk={handleUploadModalOk}
      />

    </div >
  );
};

export default MeetingLayout;