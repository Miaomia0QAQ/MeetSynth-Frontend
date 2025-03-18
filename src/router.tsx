import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import MeetingLayout from "./pages/MeetingLayout/MeetingLayout";
import HomePage from "./pages/HomePage/HomePage";
import AdminLayout from "./pages/AdminLayout/AdminLayout";
import Dashboard from "./pages/AdminLayout/Dashboard/Dashboard";
import Users from "./pages/AdminLayout/UsersAdmin/UsersAdmin";
import { ConfigProvider } from "antd";
import MeetingAdmin from "./pages/AdminLayout/MeetingAdmin/MeetingAdmin";
import UserCenter from "./pages/UserCenter/UserCenter";
import MyMeetings from "./pages/UserCenter/MyMeetings/MyMeetings";
import AccountManage from "./pages/UserCenter/AccountManage/AccountManage";
import AvatarManage from "./pages/UserCenter/AvatarManage/AvatarManage";
import PasswordChange from "./pages/UserCenter/PasswordChange/PasswordChange";

const adminTheme = {
    token: {
        colorPrimary: '#6b7c93',
        colorText: '#4a4a4a',
        colorTextSecondary: '#6b778c',
        colorBorder: '#dfe1e6',
        colorBgLayout: '#f5f6fa',
        colorBgSider: '#f8f9fa',
        borderRadius: 6,
    },
    components: {
        Layout: {
            colorBgHeader: '#ffffff',
            colorBgSider: '#f8f9fa',
        },
        Menu: {
            colorItemBgSelected: '#e9ecef',
            colorItemTextSelected: '#5a6a85',
        },
    },
};

const router = createBrowserRouter([
    {
        index: true,
        element: <HomePage />
    },
    {
        path: '/login', // 登录页面相对地址
        element: <LoginPage />,
    },
    {
        path: '/meeting',
        element: <MeetingLayout />,
    },
    {
        path: '/admin',
        element: (
            <ConfigProvider theme={adminTheme} >
                <AdminLayout />
            </ConfigProvider>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'users',
                element: <Users />,
            },
            {
                path: 'meeting',
                element: <MeetingAdmin />
            },
            // {
            //   path: 'permissions',
            //   element: <Permissions />,
            // },
        ],
    },
    {
        path: '/userCenter',
        element: <UserCenter />,
        children: [
            {
                index: true,
                element: <AccountManage />,
            },
            {
                path: 'password',
                element: <PasswordChange />,
            },
            {
                path: 'info/account',
                element: <AccountManage />,
            },
            {
                path: 'info/avatar',
                element: <AvatarManage />,
            },
            {
                path: 'meetings',
                element: <MyMeetings />
            }
        ]
    }
])

export default router;