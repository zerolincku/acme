import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ThemeController from './components/ThemeController';
import Loading from './components/Loading';
import { useStore } from './store/useStore';
import { navRoutes, type RouteConfig } from '@/lib/routes';
import { Toaster } from "@/components/ui/sonner"
import './index.css'

// Simple Auth Guard
function ProtectedRoute({ children }: { children?: React.ReactNode }) {
    const { isAuthenticated } = useStore();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}

const renderRoutes = (routes: RouteConfig[]): React.ReactNode[] => {
    return routes.flatMap((route) => {
        const elements: React.ReactNode[] = []; // 这里最好也指定类型，虽然 TS 能推断

        // If the route has a component, render it
        if (route.component) {
            const Component = route.component;
            elements.push(
                <Route
                    key={route.path}
                    path={route.path}
                    element={
                        <Suspense fallback={<Loading />}>
                            <Component />
                        </Suspense>
                    }
                />
            );
        }

        // If the route has children, recurse
        if (route.children) {
            elements.push(...renderRoutes(route.children));
        }

        return elements;
    });
};

export default function App() {
    return (
        <Router>
            <ThemeController />
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    {/* Dynamically generate routes from config */}
                    {renderRoutes(navRoutes)}

                    {/* Catch all for 404 within layout */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
            <Toaster position={"top-center"} />
        </Router>
    );
}

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
