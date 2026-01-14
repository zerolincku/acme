import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout.tsx";
import Settings from "@/pages/Settings.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true, // 默认子路由
                element: <Dashboard />,
            },
            {
                path: "/settings",
                element: <Settings />,
            }
        ]
    },
    {
        path: "/login",
        element: <Login />, // 登录页通常不需要侧边栏，所以放在外面
    },
]);
