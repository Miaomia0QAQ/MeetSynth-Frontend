import { useEffect, useState } from 'react';
import { Tabs, Table, Avatar, Tag, Button, Space, Grid, Form, Modal, message } from 'antd';
import type { TabsProps, TableColumnsType } from 'antd';
import { getPendingApplicationsAPI, getReviewedApplicationsAPI, submitReviewResultAPI } from '../../../apis/permission';

const { useBreakpoint } = Grid;

interface PermissionApplication {
    key: number;
    userId?: string;
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

    // 分页状态管理
    const [pendingState, setPendingState] = useState({
        data: [] as PermissionApplication[],
        pagination: { current: 1, pageSize: 10, total: 0 },
        loading: false
    });

    const [reviewedState, setReviewedState] = useState({
        data: [] as PermissionApplication[],
        pagination: { current: 1, pageSize: 10, total: 0 },
        loading: false
    });

    // 数据获取方法
    const fetchData = async (type: 'pending' | 'reviewed', pagination: any) => {
        const stateUpdater = type === 'pending'
            ? setPendingState
            : setReviewedState;

        stateUpdater(prev => ({ ...prev, loading: true }));

        try {
            const apiFn = type === 'pending'
                ? getPendingApplicationsAPI
                : getReviewedApplicationsAPI;

            const res = await apiFn(
                pagination.current,
                pagination.pageSize
            );

            if (res.code === 1) {
                const mappedData = res.data.list.map((item: any) => ({
                    key: item.id,
                    userId: item.userId,
                    username: item.username,
                    email: item.email,
                    avatar: item.avatar,
                    reason: item.reason,
                    status: item.status,
                    reviewer: item.reviewer
                }));

                stateUpdater(prev => ({
                    ...prev,
                    data: mappedData,
                    pagination: {
                        ...prev.pagination,
                        total: res.data.total
                    },
                    loading: false
                }));
            }
        } catch (error) {
            message.error('数据加载失败');
            stateUpdater(prev => ({ ...prev, loading: false }));
        }
    };

    // 提交审核结果
    const handleSubmitReview = async (key: number, status: 'approved' | 'rejected') => {
        console.log(key, status);
        submitReviewResultAPI(key, status).then(res => {
            if (res.code === 1) {
                message.success('审核结果提交成功');
                fetchData(activeTab === '1' ? 'pending' : 'reviewed', {
                    current: activeTab === '1' ? pendingState.pagination.current : reviewedState.pagination.current,
                    pageSize: activeTab === '1' ? pendingState.pagination.pageSize : reviewedState.pagination.pageSize
                });
            } else {
                message.error('审核结果提交失败');
            }
        })
    };

    // 标签页切换处理
    useEffect(() => {
        const type = activeTab === '1' ? 'pending' : 'reviewed';
        const pagination = activeTab === '1'
            ? pendingState.pagination
            : reviewedState.pagination;

        fetchData(type, pagination);
    }, [activeTab, pendingState.pagination.current, reviewedState.pagination.current]);

    // 分页变化处理
    const handlePaginationChange = (page: number, pageSize: number) => {
        if (activeTab === '1') {
            setPendingState(prev => ({
                ...prev,
                pagination: { ...prev.pagination, current: page, pageSize }
            }));
        } else {
            setReviewedState(prev => ({
                ...prev,
                pagination: { ...prev.pagination, current: page, pageSize }
            }));
        }
    };

    // 公共列定义（需放置在组件内部）
    const commonColumns: TableColumnsType<PermissionApplication> = [
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 80,
            render: (url) => <Avatar src={url} size="large" />
        },
        {
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 120
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            width: 150
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            width: 200
        },
        {
            title: '申请理由',
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true,
            width: 250
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 120,
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

    // 审核中专属列（带操作按钮）
    const pendingColumns: TableColumnsType<PermissionApplication> = [
        ...commonColumns,
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => handleViewDetail(record)}
                    >
                        查看
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        style={{ color: '#52c41a' }}
                        onClick={() => handleSubmitReview(record.key, 'approved')}
                    >
                        同意
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        danger
                        onClick={() => handleSubmitReview(record.key, 'rejected')}
                    >
                        拒绝
                    </Button>
                </Space>
            )
        }
    ];

    // 已审核专属列（显示审核人）
    const reviewedColumns: TableColumnsType<PermissionApplication> = [
        ...commonColumns,
        {
            title: '审核人',
            dataIndex: 'reviewer',
            key: 'reviewer',
            width: 150,
            render: (reviewer?: string) => reviewer || '系统自动处理'
        }
    ];

    // 动态表格配置
    const getTableConfig = () => {
        const isPending = activeTab === '1';
        const { data, pagination, loading } = isPending ? pendingState : reviewedState;

        return {
            columns: isPending ? pendingColumns : reviewedColumns,
            dataSource: data,
            loading,
            pagination: {
                ...pagination,
                onChange: handlePaginationChange,
                showSizeChanger: true,
                showTotal: (total: number) => `共 ${total} 条`
            },
            scroll: { x: 800 },
            bordered: true
        };
    };

    // 更新标签页配置
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `审核中 (${pendingState.pagination.total})`,
            children: <Table {...getTableConfig()} />
        },
        {
            key: '2',
            label: `已审核 (${reviewedState.pagination.total})`,
            children: <Table {...getTableConfig()} />
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