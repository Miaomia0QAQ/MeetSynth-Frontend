// SpeechTranscriber.tsx
import { Avatar } from 'antd';
import { DeleteOutlined, EditOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import AudioRecorder from '../AudioRecorder/AudioRecorder';
import RecorderInput from '../RecorderInput/RecorderInput';
import './SpeechTranscriber.css'

export interface TranscriptItem {
  id: string;
  text: string;
  editable: boolean;
}

interface SpeechTranscriberProps {
  title: string;
  hasContent: boolean;
  transcripts: TranscriptItem[];
  recorderState: 'record' | 'edit';
  editingContent: string;
  onRecord: () => void;
  onTranscriptEdit: () => void;
  onTranscriptAdd: (transcript: string) => void;
  setEditingContent: (content: string) => void;
  handleEdit: (id: string) => void;
  handleEditSubmit: (id: string) => void;
  handleEditKeyDown: (id: string, e: React.KeyboardEvent) => void;
  handleDelete: (id: string) => void;
}

const SpeechTranscriber = ({
  title,
  hasContent,
  transcripts,
  recorderState,
  editingContent,
  onRecord,
  onTranscriptEdit,
  onTranscriptAdd,
  setEditingContent,
  handleEdit,
  handleEditSubmit,
  handleEditKeyDown,
  handleDelete
}: SpeechTranscriberProps) => {
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
            {transcripts.map((item) => (
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
            ))}
          </div>
        )}
      </div>

      {recorderState === 'record' ? (
        <div className="recording-control">
          <AudioRecorder onEdit={onTranscriptEdit} />
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