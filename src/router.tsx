import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import MeetingLayout from "./pages/MeetingLayout/MeetingLayout";
import HomePage from "./pages/HomePage/HomePage";

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
        path: '/meeting', // 会议页面相对地址
        element: <MeetingLayout />,
    },
])

export default router;