import { useEffect, useState, useCallback } from 'react';
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
    notification,
    message
} from 'antd';
import {
    UserOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    ExportOutlined,
    SearchOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useDebounce } from 'use-debounce';
import { deleteUserAPI, getUserListAPI } from '../../../apis/user';

const { Text } = Typography;

interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    avatar?: string;
    meetingCount: number;
}

const Users = () => {
    const [searchKey, setSearchKey] = useState('');
    const [debouncedSearchKey] = useDebounce(searchKey, 500);
    const [showPasswordId, setShowPasswordId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [users, setUsers] = useState<User[]>([]);

    // 获取用户列表
    const getUserList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getUserListAPI(page, pageSize, debouncedSearchKey);
            if (res.code === 1) {
                const formattedUsers = res.data.list.map((item: any) => ({
                    id: item.id,
                    username: item.username,
                    email: item.email,
                    password: item.password,
                    avatar: item.avatarUrl,
                    meetingCount: item.meetingCount
                }));
                setUsers(formattedUsers);
                setTotal(res.data.total);
            }
        } catch (error) {
            message.error('获取用户列表失败');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, debouncedSearchKey]);

    // 删除用户
    const deleteUser = async (id: string) => {
        try {
            const res = await deleteUserAPI(id);
            if (res.code === 1) {
                await getUserList();
                message.success('用户已删除');
            }
        } catch (error) {
            message.error('删除用户失败');
        }
    };

    // 数据请求
    useEffect(() => {
        getUserList();
    }, [getUserList]);

    // 导出Excel
    const handleExport = () => {
        setLoading(true);
        try {
            const exportData = users.map(user => ({
                ID: user.id,
                用户名: user.username,
                邮箱: user.email,
                密码: user.password,
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
            render: (_: string, record: User) => (
                <Avatar
                    src={record.avatar}
                    icon={!record.avatar && <UserOutlined />}
                    style={{ backgroundColor: '#c4c4c4' }}
                />
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            defaultSortOrder: 'ascend' as const,
            ellipsis: true,
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
            title: '会议数',
            dataIndex: 'meetingCount',
            key: 'meetingCount',
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (record: User) => (
                <Space>
                    <Popconfirm
                        title="确认删除该用户？"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={() => deleteUser(record.id)}
                    >
                        <Button type="link" danger size="small">删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

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
                    value={searchKey}
                    onChange={(e) => {
                        setSearchKey(e.target.value);
                        setPage(1); // 重置到第一页
                    }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                bordered
                size="middle"
                scroll={{ x: 1000 }}
                loading={loading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    },
                    total: total,
                    showTotal: () => `共 ${total} 条`,
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