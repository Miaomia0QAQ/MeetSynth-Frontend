import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Layout,
    Menu,
    Breadcrumb,
    Space,
    Avatar,
    theme // 使用Ant Design的主题hook
} from 'antd';
import {
    UserOutlined,
    VideoCameraOutlined,
    SafetyOutlined,
    DashboardOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
import './AdminLayout.css'

const { Header, Sider, Content } = Layout;
const { useToken } = theme;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token } = useToken();
    const location = useLocation();

    // 菜单配置
    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            title: '数据看板',
            label: <Link to="/admin/dashboard">数据看板</Link>,
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            title: '用户管理',
            label: <Link to="/admin/users">用户管理</Link>,
        },
        {
            key: '/admin/meeting',
            icon: <VideoCameraOutlined />,
            title: '会议管理',
            label: <Link to="/admin/meeting">会议管理</Link>,
        },
        {
            key: '/admin/permissions',
            icon: <SafetyOutlined />,
            title: '权限管理',
            label: <Link to="/admin/permissions">权限管理</Link>,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }} className='admin-container'>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                breakpoint="lg"
                collapsedWidth="80"
                style={{
                    background: '#f8f9fa',
                    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
                    borderRight: `1px solid ${token.colorBorder}`
                }}
            >
                <div className="logo" style={{
                    height: 64,
                    background: `url(/logo.svg) center/contain no-repeat`,
                    margin: 16,
                    filter: 'grayscale(1) opacity(0.8)'
                }} />

                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{ borderRight: 'none' }}
                />
            </Sider>

            <Layout>
                <Header style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    borderBottom: '1px solid #f0f0f0',
                    zIndex: 1
                }}>
                    <Space>
                        {collapsed ?
                            <MenuUnfoldOutlined onClick={() => setCollapsed(false)} /> :
                            <MenuFoldOutlined onClick={() => setCollapsed(true)} />
                        }
                        <Breadcrumb
                            items={[
                                { title: 'MeetSynth' },
                                { title: '管理后台' },
                                { title: menuItems.find(item => item.key === location.pathname)?.title },
                            ]}
                        />
                    </Space>

                    <Space>
                        <Avatar icon={<UserOutlined />} />
                        <span>管理员</span>
                    </Space>
                </Header>

                <Content style={{
                    margin: '24px 16px',
                    padding: 24,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;