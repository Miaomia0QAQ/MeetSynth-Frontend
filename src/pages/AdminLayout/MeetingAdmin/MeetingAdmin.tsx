// src/pages/admin/MeetingManagement.tsx
import { useState } from 'react';
import {
    Button,
    Table,
    Space,
    Input,
    Select,
    Tag,
    Popconfirm,
    message,
    Row,
    Col
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

interface Meeting {
    id: string;
    title: string;
    startTime: string;
    organizer: string;
    status: 'preparing' | 'ongoing' | 'ended';
}

const MeetingManagement = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 模拟数据
    const mockData: Meeting[] = [
        {
            id: '1',
            title: '产品需求评审会',
            startTime: '2024-03-20 14:00',
            organizer: '张三',
            status: 'preparing'
        },
        {
            id: '2',
            title: '技术方案讨论',
            startTime: '2024-03-21 10:00',
            organizer: '李四',
            status: 'ongoing'
        },
        {
            id: '3',
            title: '项目总结会议',
            startTime: '2024-03-22 16:00',
            organizer: '王五',
            status: 'ended'
        }
    ];

    const handleDelete = (id: string) => {
        message.success('删除成功');
        // 这里实际调用删除API
    };

    const columns: ColumnsType<Meeting> = [
        {
            title: '会议标题',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            width: 180,
            sorter: (a, b) => Date.parse(a.startTime) - Date.parse(b.startTime),
        },
        {
            title: '组织者',
            dataIndex: 'organizer',
            key: 'organizer',
            width: 120,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => {
                let color = '';
                switch (status) {
                    case 'preparing':
                        color = 'blue';
                        break;
                    case 'ongoing':
                        color = 'green';
                        break;
                    case 'ended':
                        color = 'gray';
                        break;
                }
                return <Tag color={color}>{status === 'preparing' ? '准备中' :
                    status === 'ongoing' ? '进行中' : '已结束'}</Tag>;
            },
            filters: [
                { text: '准备中', value: 'preparing' },
                { text: '进行中', value: 'ongoing' },
                { text: '已结束', value: 'ended' },
            ],
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => {/* 编辑逻辑 */ }}>编辑</Button>
                    <Popconfirm
                        title="确认删除该会议？"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="link" danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filteredData = mockData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={8}>
                    <Input
                        placeholder="搜索会议标题"
                        prefix={<SearchOutlined />}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Select
                        style={{ width: '100%' }}
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        options={[
                            { value: 'all', label: '全部状态' },
                            { value: 'preparing', label: '准备中' },
                            { value: 'ongoing', label: '进行中' },
                            { value: 'ended', label: '已结束' },
                        ]}
                    />
                </Col>
                <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                    <Button type="primary" icon={<PlusOutlined />}>
                        新建会议
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50],
                    showTotal: total => `共 ${total} 条`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }
                }}
                scroll={{ x: 800 }}
            />
        </div>
    );
};

export default MeetingManagement;