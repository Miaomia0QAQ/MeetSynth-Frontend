import { Input, Button, List, Tag, Space } from 'antd';
import { AudioOutlined, UploadOutlined, DeleteOutlined, RightCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './MyMeetings.css';

const MyMeetings = () => {
  const [searchText, setSearchText] = useState('');
  
  // 模拟数据
  const meetings = [
    {
      id: 1,
      title: '产品需求评审会',
      time: '2024-03-15 14:00',
      description: '讨论下一代产品核心功能',
      leader: '张晓明',
    },
    {
      id: 2,
      title: '技术方案讨论会',
      time: '2024-03-16 10:30',
      description: '确定系统架构设计方案',
      leader: '王立伟',
    }
  ];

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
        />
      </div>

      {/* 会议列表 */}
      <List
        itemLayout="vertical"
        dataSource={meetings}
        renderItem={(item) => (
          <List.Item className="meeting-item">
            <div className="meeting-content">
              {/* 左侧信息 */}
              <div className="left-info">
                <h3 className="meeting-title">{item.title}</h3>
                <p className="meeting-desc">{item.description}</p>
              </div>
              
              {/* 右侧信息 */}
              <div className="right-info">
                <div className="info-grid">
                  <span>开始时间</span>
                  <span>{item.time}</span>
                  <span>负责人</span>
                  <span>{item.leader}</span>
                  {/* <span>状态</span>
                  <Tag color={item.status === '进行中' ? 'green' : 'blue'}>
                    {item.status}
                  </Tag> */}
                </div>
                
                <Space className="action-btns">
                  <Button 
                    type="primary" 
                    icon={<RightCircleOutlined />}
                    className="enter-btn"
                  >
                    进入
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    className="delete-btn"
                  >
                    删除
                  </Button>
                </Space>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyMeetings;