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
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/meeting',
        element: <MeetingLayout />,
    },
])

export default router;