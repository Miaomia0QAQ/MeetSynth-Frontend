import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HomeFilled, LeftCircleOutlined } from '@ant-design/icons';
import './MeetingLayout.css';
import { message, Splitter } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import AISummary, { AISummaryRef } from './AISummary/AISummary';
import Sidebar from './Siderbar/Siderbar';
import MeetingInfoModal from './MeetingInfoModal/MeetingInfoModal';
import UploadModal from './UploadModal/UploadModal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SpeechTranscriber from './SpeechTranscriber/SpeechTranscriber';
import { getMeetingAPI, getRoleAPI, saveTranscriptAPI } from '../../apis/meeting';
import { meetingInfo } from '../../types/meetingInfo';
import { debounce } from 'lodash-es';

export interface TranscriptItem {
  text: string;
  editable: boolean;
  speaker: string;
}

interface RawTranscriptItem {
  speaker: string;
  text: string;
}
const MeetingLayout = () => {
  const [searchParams] = useSearchParams();
  // 会议id
  const id = searchParams.get('id') || '';
  // 会议标题
  const [info, setInfo] = useState<meetingInfo>({ id: id });
  // 会议内容是否存在
  const [hasContent, setHasContent] = useState<boolean>(false);
  // 录音转文字内容
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  // 用户编辑内容
  const [editingContent, setEditingContent] = useState('');
  // 左右版块大小
  const [panelSize, setPanelSize] = useState<(number | string)[]>(['100%', '0%']);
  // 录音状态
  const [recorderState, setRecorderState] = useState<'record' | 'edit'>('record');
  // 录音保存状态
  const [isSaving, setIsSaving] = useState(false);
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
      summaryRef.current?.sendRequest();
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
    setTranscripts(prev => [...prev, { text: transcript, editable: false, speaker: '0' }])
  }

  const onTranscriptUpdate = (transcript: string) => {
    setTranscripts(prev => {
      // 数组为空时创建新元素
      if (prev.length === 0) {
        return [{ text: transcript, editable: false, speaker: '0' }];
      }
      // 数组有元素时更新最后一个元素的text
      return prev.map((item, index) =>
        index === prev.length - 1
          ? { ...item, text: item.text + transcript }
          : item
      );
    });
  }

  // 处理可编辑事件
  const handleEdit = (index: number) => {
    if (editingContent !== '') return;
    setEditingContent(transcripts[index].text || '')
    setTranscripts(prev => prev.map((item, i) => i === index ? { ...item, editable: true } : item))
  }

  // 处理编辑提交事件
  const handleEditSubmit = (index: number) => {
    setTranscripts(prev => prev.map((item, i) => i === index ? { ...item, text: editingContent, editable: false } : item))
    setEditingContent('')
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

  // 角色区分
  const getRole = async (text: string) => {
    try {
      // 调用API获取角色区分结果
      const res = await getRoleAPI(id, text);
      
      if (res.code !== 1) {
        throw new Error(res.msg || '角色区分失败');
      }
  
      // 转换数据格式并保留可编辑状态
      const newItems: TranscriptItem[] = res.data.map((item: RawTranscriptItem) => ({
        text: item.text,
        speaker: item.speaker,
        editable: false
      }));
  
      // 替换最后一个元素并保持数组引用不变
      setTranscripts(prev => {
        // 保留最后一个元素之前的内容
        const base = prev.slice(0, -1); 
        // 合并新解析的内容
        return [...base, ...newItems];
      });
  
    } catch (err) {
      console.error('角色区分错误:', err);
      throw err;
    }
  }

  // 获取当前日期
  const getDate = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }

  // 处理录音转文字数据格式
  const processTranscript = (rawData: RawTranscriptItem[]): TranscriptItem[] => {
    if (rawData.length === 0) return [];

    const result: TranscriptItem[] = [];
    let currentItem: TranscriptItem = {
      speaker: rawData[0].speaker,
      text: rawData[0].text,
      editable: false
    };

    for (let i = 1; i < rawData.length; i++) {
      const item = rawData[i];
      if (item.speaker === currentItem.speaker) {
        currentItem.text += item.text;
      } else {
        result.push(currentItem);
        currentItem = {
          speaker: item.speaker,
          text: item.text,
          editable: false
        };
      }
    }

    result.push(currentItem);
    return result;
  }

  // 获取会议信息
  const getMeetingInfo = () => {
    getMeetingAPI(id).then(res => {
      if (res.code === 1) {
        const { title, description, startTime, participants, leader, recording, content } = res.data;
        // 处理会议信息
        setInfo({ ...info, title, description, startTime, participants, leader });
        // 处理会议内容
        setTranscripts(processTranscript(JSON.parse(recording)));
        // 处理会议总结
        summaryRef.current?.setSummary(content);
      }
    })
  }

  // 保存录音转译
  const saveTranscript = useCallback(async (textContent: string) => {
    try {
      setIsSaving(true);
      const res = await saveTranscriptAPI(id, textContent);
      if (res.code !== 1) {
        message.error(res.msg || '自动保存失败');
      }
    } catch (err) {
      message.error('保存失败，请检查网络');
      console.error('保存错误:', err);
    } finally {
      setIsSaving(false);
    }
  }, [id]);

  const debouncedSave = useMemo(() =>
    debounce((content: string) => {
      if (isSaving) return; // 如果正在保存，则不执行
      if (content) saveTranscript(content);
    }, 5000)
    , [saveTranscript]);

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
    getMeetingInfo();
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
      getMeetingInfo();
    }
    // 离开时强制保存最后一次修改
    return () => {
      debouncedSave.cancel();
      const lastContent = JSON.stringify(transcripts.map(({ editable, ...rest }) => rest));
      if (lastContent && lastContent !== '[]') saveTranscript(lastContent);
    };
  }, [])

  useEffect(() => {
    if (transcripts.length > 0 && transcripts[0].text) {
      setHasContent(true);
    }
  }, [transcripts])

  // 自动保存触发逻辑
  useEffect(() => {
    const content = JSON.stringify(transcripts.map(({ editable, ...rest }) => rest))

    if (content) {
      debouncedSave(content);
    }

    return () => debouncedSave.cancel();
  }, [transcripts, debouncedSave]);

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
              <div className="date-box">
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour12: false
                }).replace(/\//g, '/')}
              </div>
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
                id={id}
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
                getRole={getRole}
              />
            </Splitter.Panel>

            <Splitter.Panel className="right-panel" collapsible={true} size={panelSize[1]}>
              <AISummary id={id} ref={summaryRef} />
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
        info={info}
        setInfo={setInfo}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onCancel={handleUploadModalCancel}
        onOk={handleUploadModalOk}
        id={id}
      />

    </div>
  );
};

export default MeetingLayout;