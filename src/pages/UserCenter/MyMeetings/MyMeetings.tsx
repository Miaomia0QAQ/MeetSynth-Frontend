import { Input, Button, List, Space, Pagination, message } from 'antd';
import { AudioOutlined, UploadOutlined, DeleteOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import './MyMeetings.css';
import { deleteMeetingAPI, getUserMeetingListAPI } from '../../../apis/meeting';
import { useNavigate } from 'react-router-dom';

const MyMeetings = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [meetingList, setMeetingList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
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

  useEffect(() => {
    fetchMeetings();
  }, [currentPage, pageSize]);

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

  return (
    <div className="mymeetings-container">
      {/* 操作栏 */}
      <div className="action-bar">
        <Space>
          <Button
            type="primary"
            icon={<AudioOutlined />}
            className="record-btn dark"
          >
            创建会议
          </Button>
          <Button
            icon={<UploadOutlined />}
            className="record-btn light"
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
    </div>
  );
};

export default MyMeetings;