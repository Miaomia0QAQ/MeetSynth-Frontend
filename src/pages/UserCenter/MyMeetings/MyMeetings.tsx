import { Input, Button, List, Space, Pagination, message, Modal, Upload, Spin, Flex } from 'antd';
import { AudioOutlined, UploadOutlined, DeleteOutlined, RightCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import './MyMeetings.css';
import { createMeetingByAudioAPI, deleteMeetingAPI, getUserMeetingListAPI } from '../../../apis/meeting';
import { useNavigate } from 'react-router-dom';
import { useCreateMeeting } from '../../../component/useCreateMeeting/useCreateMeeting';
import { MeetingFormComponent } from './MeetingFormComponent/MeetingFormComponent';

const MyMeetings = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [meetingList, setMeetingList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const { Dragger } = Upload;
  const { formData, handleInputChange, handleSubmit } = useCreateMeeting();
  const navigate = useNavigate();

  // 获取会议数据
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await getUserMeetingListAPI(
        currentPage,
        pageSize,
        searchText,
        searchText
      );

      if (res.code === 1) {
        setMeetingList(res.data.meetingList);
        setTotal(res.data.total);
      } else {
        message.error(res.msg || '获取数据失败');
      }
    } catch (err) {
      message.error('请求失败');
    } finally {
      setLoading(false);
    }
  };

  // 搜索处理
  const handleSearch = () => {
    setCurrentPage(1); // 搜索时重置到第一页
    fetchMeetings();
  };

  // 分页变化处理
  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // 新增创建会议处理
  const handleCreateMeeting = async () => {
    const meetingId = await handleSubmit();
    if (meetingId) {
      setCreateModalVisible(false);
      navigate(`/meeting?id=${meetingId}`);
    }
  };

  // 进入会议处理
  const handleEnterMeeting = (meetingId: string) => {
    navigate('/meeting?id=' + meetingId)
  };

  // 删除会议处理
  const handleDeleteMeeting = async (meetingId: string) => {
    deleteMeetingAPI(meetingId).then((res) => {
      if (res.code === 1) {
        message.success('删除成功');
        fetchMeetings();
      } else {
        message.error(res.msg || '删除失败');
      }
    }).catch(err => console.log(err));
  };

  // 上传处理逻辑
  const handleAudioUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      const result = await createMeetingByAudioAPI(file);
      if (result.code === 1) {
        message.success('音频处理完成，正在进入会议...');
        navigate(`/meeting?id=${result.data.id}`);
        setUploadModalVisible(false);
      } else {
        message.error(result.msg || '音频处理失败');
      }
    } catch (error) {
      message.error('上传过程中发生错误');
      console.error('上传错误:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [currentPage, pageSize]);

  return (
    <div className="mymeetings-container">
      {/* 操作栏 */}
      <div className="action-bar">
        <Space>
          <Button
            type="primary"
            icon={<AudioOutlined />}
            className="record-btn dark"
            onClick={() => setCreateModalVisible(true)}
          >
            创建会议
          </Button>
          <Button
            icon={<UploadOutlined />}
            className="record-btn light"
            onClick={() => setUploadModalVisible(true)}
          >
            录入音频
          </Button>
        </Space>

        <Input.Search
          placeholder="搜索会议..."
          allowClear
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

      {/* 会议列表 */}
      <List
        itemLayout="vertical"
        dataSource={meetingList}
        loading={loading}
        renderItem={(item) => (
          <List.Item className="meeting-item">
            <div className="meeting-content">
              <div className="left-info">
                <h3 className="meeting-title">{item.title}</h3>
                <p className="meeting-desc">{item.description}</p>
              </div>

              <div className="right-info">
                <div className="info-grid">
                  <span>开始时间</span>
                  <span>{item.startTime}</span>
                  <span>负责人</span>
                  <span>{item.leader}</span>
                </div>

                <Space className="action-btns">
                  <Button
                    type="primary"
                    icon={<RightCircleOutlined />}
                    className="enter-btn"
                    onClick={() => handleEnterMeeting(item.id)}
                  >
                    进入
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    className="delete-btn"
                    onClick={() => handleDeleteMeeting(item.id)}
                  >
                    删除
                  </Button>
                </Space>
              </div>
            </div>
          </List.Item>
        )}
      />

      {/* 分页组件 */}
      <Pagination
        className="pagination"
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
        showSizeChanger
        showQuickJumper
        showTotal={total => `共 ${total} 条`}
      />

      {/* 创建会议模态框 */}
      <Modal
        title="快速创建会议"
        open={createModalVisible}
        onOk={handleCreateMeeting}
        onCancel={() => setCreateModalVisible(false)}
        okText="立即开始"
        cancelText="取消"
        className="my-meeting-modal"
        width={600}
      >
        <div className="modal-form-wrapper">
          <MeetingFormComponent
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>
      </Modal>

      {/* 新增上传模态框 */}
      <Modal
        title="上传会议音频"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        className="my-meeting-modal"
        width={600}
        destroyOnClose
      >
        <Spin spinning={uploadLoading} tip="音频解析中..." size="large">
          <div className="upload-content-wrapper">
            <Dragger
              accept="audio/*,video/*"
              multiple={false}
              beforeUpload={(file) => {
                handleAudioUpload(file);
                return false;
              }}
              showUploadList={false}
              disabled={uploadLoading}
            >
              <div className="uploader-inner">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: 48, color: 'var(--primary-color)' }} />
                </p>
                <p className="upload-title">拖拽或点击上传会议录音</p>
                <p className="upload-subtitle">支持格式：MP3/WAV/MP4</p>
                <p className="upload-tip">系统将自动生成会议纪要和待办事项</p>
              </div>
            </Dragger>

            <div className="feature-cards">
                <div className="feature-card">
                  <h4>智能解析</h4>
                  <p>自动区分发言人</p>
                </div>
                <div className="feature-card">
                  <h4>多语言支持</h4>
                  <p>中/英/日多语言识别</p>
                </div>
            </div>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default MyMeetings;