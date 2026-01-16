import { lazy, Suspense } from 'react';
import { createBrowserRouter, redirect } from "react-router-dom";
import { useStore } from '@/store/useStore';
import Layout from "@/components/Layout.tsx";
import Loading from "@/components/Loading.tsx";

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Settings = lazy(() => import('@/pages/Settings'));
const Login = lazy(() => import('@/pages/Login'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// 认证检查函数
const protectedLoader = () => {
    const isAuthenticated = useStore.getState().isAuthenticated;

    if (!isAuthenticated) {
        return redirect('/login');
    }

    return null;
};

// 游客检查函数（已登录用户不能访问登录页）
const guestLoader = () => {
    const isAuthenticated = useStore.getState().isAuthenticated;

    if (isAuthenticated) {
        return redirect('/');
    }

    return null;
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        loader: protectedLoader, // 添加认证检查
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Loading />}>
                        <Dashboard />
                    </Suspense>
                )
            },
            {
                path: "/settings",
                element: (
                    <Suspense fallback={<Loading />}>
                        <Settings />
                    </Suspense>
                )
            }
        ]
    },
    {
        path: "/login",
        element: (
            <Suspense fallback={<Loading />}>
                <Login />
            </Suspense>
        ),
        loader: guestLoader, // 添加游客检查（已登录用户不能访问登录页）
    },
    {
        path: "*",
        element: (
            <Suspense fallback={<Loading />}>
                <NotFound />
            </Suspense>
        ), // 添加 404 路由
    },
]);
