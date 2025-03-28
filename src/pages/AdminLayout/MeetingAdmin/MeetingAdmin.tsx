// src/pages/admin/MeetingManagement.tsx
import { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Table,
  Space,
  Input,
  Popconfirm,
  message,
  Row,
  Col,
  Typography
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import { deleteMeetingAPI, getMeetingListAPI } from '../../../apis/meeting';

const { Text } = Typography;

interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: string;
  username: string;
  leader: string;
  // 存储但不展示的字段
  userId?: string;
  participants?: string;
}

const MeetingManagement = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedKeyword] = useDebounce(searchKeyword, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取会议数据
  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMeetingListAPI(
        currentPage,
        pageSize,
        debouncedKeyword,
        debouncedKeyword
      );
      
      if (res.code === 1) {
        const formattedData = res.data.meetingList.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          startTime: item.startTime,
          username: item.username,
          leader: item.leader,
          // 存储备用字段
          userId: item.userId,
          participants: item.participants
        }));
        setMeetings(formattedData);
        setTotal(res.data.total);
      }
    } catch (error) {
      message.error('获取会议列表失败');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedKeyword]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteMeetingAPI(id);
      if (res.code === 1) {
        message.success('已删除会议');
      } else {
        message.error(res.msg || '删除失败');
      }
      await fetchMeetings();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns: ColumnsType<Meeting> = [
    {
      title: '会议标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: '会议描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 300
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
      sorter: (a, b) => Date.parse(a.startTime) - Date.parse(b.startTime)
    },
    {
      title: '组织者',
      dataIndex: 'username',
      key: 'username',
      width: 120
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      key: 'leader',
      width: 120,
      render: (text) => text || '--'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => {/* 编辑逻辑 */}}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该会议？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={16}>
          <Input
            placeholder="搜索会议标题/描述"
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1); // 重置到第一页
            }}
            allowClear
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={meetings}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          total: total,
          showTotal: () => `共 ${total} 条`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          }
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default MeetingManagement;