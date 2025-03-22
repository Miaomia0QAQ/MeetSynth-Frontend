import { useState } from 'react';
import { Tabs, Table, Avatar, Tag, Button, Space, Grid, Form, Modal } from 'antd';
import type { TabsProps, TableColumnsType } from 'antd';

const { useBreakpoint } = Grid;

interface PermissionApplication {
    key: string;
    username: string;
    email: string;
    avatar: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewer?: string;
}

const PermissionsAdmin = () => {
    const [activeTab, setActiveTab] = useState<string>('1');
    const [selectedApplication, setSelectedApplication] = useState<PermissionApplication | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const screens = useBreakpoint();

    // 模拟数据
    const pendingData: PermissionApplication[] = [
        {
            key: '1',
            username: '张三',
            email: 'zhangsan@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            reason: '需要管理用户权限需要管理用户权限需要管理用户权限需要管理用户权限需要管理用户权限需要管理用户权限',
            status: 'pending'
        },
        // 更多数据...
    ];

    const reviewedData: PermissionApplication[] = [
        {
            key: '2',
            username: '李四',
            email: 'lisi@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            reason: '需要内容审核权限',
            status: 'approved',
            reviewer: '管理员'
        },
        {
            key: '3',
            username: '王五',
            email: 'wangwu@example.com',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            reason: '需要内容审核权限',
            status: 'approved',
            reviewer: '管理员'
        },
    ];

    // 公共列定义
    const commonColumns: TableColumnsType<PermissionApplication> = [
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 80,
            render: (url) => <Avatar src={url} size="large" />
        },
        {
            title: 'ID',
            dataIndex: 'key',
            key: 'userId',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '申请理由',
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'pending' | 'approved' | 'rejected') => {
                const statusMap = {
                    pending: { color: 'processing', text: '审核中' },
                    approved: { color: 'success', text: '已同意' },
                    rejected: { color: 'error', text: '已拒绝' }
                };
                return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
            }
        }
    ];

    // 审核中专属列
    const pendingColumns: TableColumnsType<PermissionApplication> = [
        ...commonColumns,
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => handleViewDetail(record)}
                    >
                        查看
                    </Button>
                    <Button type="link" size="small" style={{ color: '#52c41a' }}>同意</Button>
                    <Button type="link" size="small" danger>拒绝</Button>
                </Space>
            )
        }
    ];

    // 已审核专属列
    const reviewedColumns: TableColumnsType<PermissionApplication> = [
        ...commonColumns,
        {
            title: '审核人',
            dataIndex: 'reviewer',
            key: 'reviewer',
            width: 120
        }
    ];

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `审核中 (${pendingData.length})`,
            children: (
                <Table
                    columns={pendingColumns}
                    dataSource={pendingData}
                    scroll={{ x: 800 }}
                    pagination={false}
                    bordered
                />
            )
        },
        {
            key: '2',
            label: `已审核 (${reviewedData.length})`,
            children: (
                <Table
                    columns={reviewedColumns}
                    dataSource={reviewedData}
                    scroll={{ x: 800 }}
                    pagination={false}
                    bordered
                />
            )
        }
    ];

    // 查看详情处理
    const handleViewDetail = (record: PermissionApplication) => {
        setSelectedApplication(record);
        setModalVisible(true);
    };

    // 关闭对话框
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedApplication(null);
    };

    // 状态标签渲染
    const statusRenderer = (status: 'pending' | 'approved' | 'rejected') => {
        const statusMap = {
            pending: { color: 'processing', text: '审核中' },
            approved: { color: 'success', text: '已同意' },
            rejected: { color: 'error', text: '已拒绝' }
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
    };

    return (
        <div style={{
            padding: screens.xs ? '0 10px' : '0 24px',
            backgroundColor: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%',
            overflowY: 'auto'
        }}>
            {/* 申请查看模态框 */}
            <Modal
                title="申请详情"
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        关闭
                    </Button>
                ]}
                width={600}
            >
                {selectedApplication && (
                    <Form
                        layout="horizontal"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        initialValues={selectedApplication}
                    >
                        <Form.Item label="用户ID" name="userId">
                            <span className="ant-form-text">{selectedApplication.key}</span>
                        </Form.Item>

                        <Form.Item label="用户名" name="username">
                            <span className="ant-form-text">{selectedApplication.username}</span>
                        </Form.Item>

                        <Form.Item label="用户邮箱" name="email">
                            <span className="ant-form-text">{selectedApplication.email}</span>
                        </Form.Item>

                        <Form.Item label="申请理由" name="reason">
                            <div style={{
                                padding: 8,
                                backgroundColor: '#fafafa',
                                borderRadius: 4
                            }}>
                                {selectedApplication.reason}
                            </div>
                        </Form.Item>

                        <Form.Item label="当前状态">
                            {statusRenderer(selectedApplication.status)}
                        </Form.Item>

                        {selectedApplication.reviewer && (
                            <Form.Item label="审核人" name="reviewer">
                                <span className="ant-form-text">{selectedApplication.reviewer}</span>
                            </Form.Item>
                        )}
                    </Form>
                )}
            </Modal>

            <Tabs
                activeKey={activeTab}
                items={items}
                onChange={setActiveTab}
                tabBarStyle={{
                    marginBottom: 24,
                    borderBottom: '1px solid #f0f0f0'
                }}
            />
        </div>
    );
};

export default PermissionsAdmin;