import { use, useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, HomeFilled, LeftCircleOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import './MeetingLayout.css';
import { Avatar, Button, Modal, Splitter } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import AISummary, { AISummaryRef } from './AISummary/AISummary';
import { DeepseekIcon } from '../../component/Icons';
import Sidebar from './Siderbar/Siderbar';
import AudioRecorder from './AudioRecorder/AudioRecorder';
import MeetingInfoModal from './MeetingInfoModal/MeetingInfoModal';
import UploadModal from './UploadModal/UploadModal';

const defaultTranscripts = [
  {
    id: '1',
    text: '我今天很开心，因为今天是星期五，所以',
    editable: false,
  },
  {
    id: '2',
    text: '今天是星期五，所以',
    editable: false,
  },
  {
    id: '3',
    text: '今天是fsefes，所以',
    editable: false,
  },
  {
    id: '4',
    text: '今天是星期hhh，所以',
    editable: false,
  },
  {
    id: '5',
    text: '今天是星期五，于是',
    editable: false,
  },
  {
    id: '6',
    text: '房间很冷，所以',
    editable: false,
  },
  {
    id: '7',
    text: '今天是星期五，所以',
    editable: false,
  }
]
const MeetingLayout = () => {
  // 会议id
  const [id, setId] = useState<string>('');
  // 会议标题
  const [title, setTitle] = useState<string>('第23届联合国大会');
  // 会议内容是否存在
  const [hasContent, setHasContent] = useState<boolean>(false);
  // 录音转文字内容
  const [transcripts, setTranscripts] = useState(defaultTranscripts);
  // 用户编辑内容
  const [editingContent, setEditingContent] = useState('');
  // 左右版块大小
  const [panelSize, setPanelSize] = useState<(number | string)[]>(['100%', '0%']);

  /*
   下面是模态框相关状态
  */
  // 信息模态框开关状态
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  // 上传模态框开关状态
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const summaryRef = useRef<AISummaryRef>(null)

  // AI总结事件
  const handleSummarize = () => {
    if (panelSize[1] !== '0%' && panelSize[1] !== 0 && panelSize[1] !== '0') {
      return;
    }
    setPanelSize(['50%', '50%']);
  }

  // 处理编辑内容
  const onTranscriptEdit = () => {
    setHasContent(true);
  };

  const onTranscriptUpdate = (content: string) => {

  };

  const onStopRecording = () => {

  };

  // 处理可编辑事件
  const handleEdit = (id: string) => {
    setEditingContent(transcripts.find(item => item.id === id)?.text || '')
    setTranscripts(prev => prev.map(item => item.id === id ? { ...item, editable: true } : item))
  }

  // 处理编辑提交事件
  const handleEditSubmit = (id: string) => {
    setTranscripts(prev => prev.map(item => item.id === id ? { ...item, text: editingContent, editable: false } : item))
    setEditingContent('')
    console.log(666)
  }

  // 处理编辑状态时的回车事件（提交）
  const handleEditKeyDown = (id: string, e: any) => {
    if (e.keyCode === 13) {
      handleEditSubmit(id)
    }
  }

  // 删除录音内容
  const handleDelete = (id: string) => {
    setTranscripts(prev => prev.filter(item => item.id !== id))
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

  // 渲染
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
            <Splitter.Panel className={`left-panel ${hasContent ? 'has-content' : ''}`} size={panelSize[0]}>
              <h1 className='meeting-title'>
                {title}
              </h1>

              {/* 内容区域 */}
              <div className="content-wrapper">
                {/* 空状态提示 */}
                {!hasContent &&
                  <div className={`empty-state ${hasContent ? 'fade-out' : ''}`}>
                    <p className="tip-text">点击下方按钮开始录音，实时转写会议内容</p>
                  </div>
                }

                {/* 转写内容区域 */}
                {hasContent && (
                  <div className="transcript-container">
                    {
                      transcripts.map((item) => (
                        <div key={item.id} className='message-container'>
                          <Avatar
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#c4c4c4', margin: '5px 8px 0 0' }}
                          />
                          <div className="transcript-item">
                            {item.editable ? (
                              <>
                                <textarea
                                  className="edit-textarea"
                                  value={editingContent}
                                  onChange={(e) => setEditingContent(e.target.value)}
                                  onKeyDown={(e) => handleEditKeyDown(item.id, e)}
                                  autoFocus
                                />
                                <SendOutlined
                                  onClick={() => handleEditSubmit(item.id)}
                                  className="submit-icon"
                                />
                              </>
                            ) : (
                              <>
                                <span className="text">{item.text}</span>
                                <div className="action-buttons">
                                  <EditOutlined onClick={() => handleEdit(item.id)} className="edit-icon" />
                                  <DeleteOutlined onClick={() => handleDelete(item.id)} className="delete-icon" />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>

              <div className="recording-control">
                <AudioRecorder onEdit={onTranscriptEdit} />
              </div>
            </Splitter.Panel>

            <Splitter.Panel className="right-panel" collapsible={true} size={panelSize[1]}>
              <div className='summary-header'>
                <div className="icon-box">
                  <DeepseekIcon />
                </div>
                <Button type='primary' onClick={handleSummarize}>生成总结</Button>
              </div>
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