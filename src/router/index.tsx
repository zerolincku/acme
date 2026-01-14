import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "users",
                element: <div>用户管理</div>,
            }
        ]
    },
    {
        path: "/login",
        element: <Login />,
    },
]);
