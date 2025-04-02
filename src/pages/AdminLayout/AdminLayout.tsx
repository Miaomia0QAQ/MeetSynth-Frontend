import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Layout,
    Menu,
    Breadcrumb,
    Space,
    Avatar,
    theme, // 使用Ant Design的主题hook
    Dropdown,
    MenuProps
} from 'antd';
import {
    UserOutlined,
    VideoCameraOutlined,
    SafetyOutlined,
    DashboardOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    AlignLeftOutlined,
    HomeOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import './AdminLayout.css'
import { getUserInfoAPI } from '../../apis/user';

const { Header, Sider, Content } = Layout;
const { useToken } = theme;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<any>({});
    const { token } = useToken();
    const location = useLocation();

    // 时间问候语生成器
    const timeGreeting = (): string => {
        const hour: number = new Date().getHours();

        // 使用元组类型明确定义每个区间的类型
        const timeSlots: [number, number, string][] = [
            [0, 6, '凌晨好'],
            [6, 9, '早上好'],
            [9, 12, '上午好'],
            [12, 14, '中午好'],
            [14, 18, '下午好'],
            [18, 24, '晚上好']
        ];

        const greeting = timeSlots.find(
            ([start, end]) => hour >= start && hour < end
        )?.[2];

        return greeting || '您好';
    };

    // 获取用户信息（复用header组件逻辑）
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getUserInfoAPI().then((res) => {
                if (res.code === 1) {
                    const { id, username, email, avatarUrl, role } = res.data;
                    setUserInfo({ id, username, email, avatarUrl, role });
                }
            });
        }
    }, []);

    // 下拉菜单配置
    const items: MenuProps['items'] = [
        {
            key: 'home',
            label: '回到主页',
            icon: <HomeOutlined />,
            onClick: () => navigate('/')
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: '退出登录',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    ];

    // 菜单配置
    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            title: '数据看板',
            label: <Link to="/admin/dashboard">数据看板</Link>,
        },
        {
            key: 'admin',
            icon: <AlignLeftOutlined />,
            title: '平台管理',
            label: <span>平台管理</span>,
            children: [
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
            ]
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 64,
                    padding: '0 16px',
                    flexShrink: 0,
                }}>
                    {/* 右侧艺术字标题 */}
                    {!collapsed ? <h1 style={{
                        margin: 0,
                        fontSize: 24,
                        fontWeight: 400,
                        color: 'rgb(204, 208, 220)',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        letterSpacing: '1.5px',
                        fontFamily: "'Lucida Handwriting', cursive",
                        // animation: 'float 3s ease-in-out infinite'
                    }}>
                        MeetSynth
                    </h1> : <div
                        style={{
                            width: 30,
                            height: 30,
                            background: `url(${new URL('../../assets/透明底Logo.png', import.meta.url).href}) no-repeat center/contain`,
                            flexShrink: 0,
                            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
                        }} >
                    </div>}
                </div>

                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{ borderRight: 'none' }}
                    defaultOpenKeys={['admin']}
                />
            </Sider>

            <Layout style={{ height: '100vh' }}>
                <Header style={{
                    padding: '0 24px',
                    background: '#ccd0dc',
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

                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                        dropdownRender={(menu) => (
                            <div className="ant-dropdown-menu">
                                <div className="ant-dropdown-menu-header">
                                    <div style={{ padding: '8px 12px', color: '#666' }}>
                                        当前身份：管理员
                                    </div>
                                </div>
                                {menu}
                            </div>
                        )}
                    >
                        <Space
                            style={{
                                cursor: 'pointer',
                                padding: '0 16px',
                                transition: 'background 0.3s',
                                borderRadius: 8,
                            }}
                        >
                            <Avatar
                                src={userInfo.avatarUrl}
                                style={{
                                    backgroundColor: userInfo.avatarUrl ? 'transparent' : '#1890ff',
                                    border: '2px solid #e6f4ff',
                                    width: 40,
                                    height: 40,
                                }}
                                icon={!userInfo.avatarUrl && <UserOutlined />}
                            />
                            <div style={{ lineHeight: 1.2 }}>
                                <div style={{
                                    fontSize: 12,
                                    color: '#666',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {timeGreeting()}
                                </div>
                                <div style={{
                                    fontWeight: 500,
                                    maxWidth: 120,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {userInfo.username}
                                </div>
                            </div>
                        </Space>
                    </Dropdown>
                </Header>

                <Content style={{
                    margin: '24px 16px',
                    padding: 24,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    height: '100%',
                    overflow: 'auto'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;