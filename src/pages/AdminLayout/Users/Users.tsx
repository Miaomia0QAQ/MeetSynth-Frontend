// src/pages/Users.tsx
import { useState } from 'react';
import {
    Table,
    Input,
    Space,
    Button,
    Avatar,
    Typography,
    Popconfirm,
    Card,
    Tooltip,
    notification
} from 'antd';
import {
    UserOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    ExportOutlined,
    SearchOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Text } = Typography;

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    avatar?: string;
}

const Users = () => {
    const [users] = useState<User[]>([
        // 模拟数据...
        {
            id: 354,
            username: 'john_doe',
            email: 'john@meetsynth.com',
            password: 'password123',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
            id: 345,
            username: 'john_doe',
            email: 'john@meetsynth.com',
            password: 'password123',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },{
            id: 345,
            username: 'john_doe',
            email: 'john@meetsynth.com',
            password: 'password123',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },{
            id: 358,
            username: 'john_doe',
            email: 'john@meetsynth.com',
            password: 'password123',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },{
            id: 5348,
            username: 'john_doe',
            email: 'john@meetsynth.com',
            password: 'password123',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },{
            id: 783,
            username: 'john_doe',
            email: 'john@meetsynth.com',
            password: 'password123',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },{
            id: 738,
            username: 'john_doe',
            email: 'john@meetsynth.com',
            password: 'password123',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },{
            id: 34,
            username: 'john_doe',
            email: 'john@meetsynth.com',
            password: 'password123',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },
    ]);

    const [searchKey, setSearchKey] = useState('');
    const [showPasswordId, setShowPasswordId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // 导出Excel
    const handleExport = () => {
        setLoading(true);

        try {
            const exportData = filteredUsers.map(user => ({
                ID: user.id,
                用户名: user.username,
                邮箱: user.email,
                密码: '********', // 保持安全隐藏
                头像链接: user.avatar || ''
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "用户数据");
            XLSX.writeFile(workbook, `用户数据_${new Date().toISOString().slice(0, 10)}.xlsx`);

            notification.success({
                message: '导出成功',
                description: '数据已成功导出为Excel文件'
            });
        } catch (error) {
            notification.error({
                message: '导出失败',
                description: '导出过程中出现错误'
            });
        } finally {
            setLoading(false);
        }
    };

    // 列配置
    const columns = [
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 80,
            align: 'center' as const,
            render: (text: string, record: User) => (
                <Avatar
                    src={record.avatar}
                    icon={!record.avatar && <UserOutlined />}
                    style={{ backgroundColor: '#7265e6' }}
                />
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            sorter: (a: User, b: User) => a.id - b.id,
            defaultSortOrder: 'ascend' as const,
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            sorter: (a: User, b: User) => a.username.localeCompare(b.username),
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
        },
        {
            title: '密码',
            key: 'password',
            width: 160,
            render: (record: User) => (
                <Space>
                    <Text style={{ fontFamily: 'monospace' }}>
                        {showPasswordId === record.id ?
                            record.password :
                            '••••••••'
                        }
                    </Text>
                    <Tooltip title={showPasswordId === record.id ? '隐藏密码' : '显示密码'}>
                        <Button
                            type="text"
                            icon={showPasswordId === record.id ?
                                <EyeInvisibleOutlined /> :
                                <EyeOutlined />
                            }
                            onClick={() => setShowPasswordId(
                                showPasswordId === record.id ? null : record.id
                            )}
                        />
                    </Tooltip>
                </Space>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: () => (
                <Space>
                    <Button type="link" size="small">编辑</Button>
                    <Popconfirm
                        title="确认删除该用户？"
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" danger size="small">删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchKey.toLowerCase()) ||
        user.email.toLowerCase().includes(searchKey.toLowerCase())
    );

    return (
        <Card
            title="用户管理"
            extra={
                <Button
                    type="primary"
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                    loading={loading}
                >
                    导出数据
                </Button>
            }
        >
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Input
                    placeholder="搜索用户（用户名/邮箱）"
                    allowClear
                    prefix={<SearchOutlined />}
                    style={{ width: 400 }}
                    onChange={(e) => setSearchKey(e.target.value)}
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                bordered
                size="middle"
                scroll={{ x: 1000 }}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                    showTotal: total => `共 ${total} 条`,
                }}
                style={{
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            />
        </Card>
    );
};

export default Users;