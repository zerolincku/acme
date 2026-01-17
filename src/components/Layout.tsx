import React, { useMemo } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { PanelLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { navRoutes } from '../lib/routes';

export default function Layout() {
    const { toggleSidebar } = useStore();
    const location = useLocation();

    // 动态生成面包屑
    const breadcrumbs = useMemo(() => {
        const parts = location.pathname.split('/').filter(Boolean);
        const crumbs: { label: string; path: string }[] = [];

        // 首页处理
        if (location.pathname === '/') {
            crumbs.push({ label: 'Dashboard', path: '/' });
            return crumbs;
        }

        let searchCollection = navRoutes;
        let accumulatedPath = '';

        parts.forEach((segment) => {
            accumulatedPath += `/${segment}`;
            const match = searchCollection.find(r => r.path === accumulatedPath || r.path.endsWith(segment));

            if (match) {
                crumbs.push({ label: match.label, path: match.path });
                if (match.children) searchCollection = match.children;
            } else {
                crumbs.push({
                    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
                    path: accumulatedPath
                });
            }
        });

        return crumbs;
    }, [location.pathname]);

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* 侧边栏 */}
            <Sidebar />

            {/* 主内容区域 */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* 右侧 Header */}
                <header className="h-14 border-b flex items-center px-4 gap-4 bg-background/95 backdrop-blur shrink-0 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={toggleSidebar}
                    >
                        <PanelLeft className="h-5 w-5" />
                    </Button>

                    <div className="h-4 w-[1px] bg-border mx-1" />

                    {/* 面包屑导航 */}
                    <nav className="flex items-center text-sm font-medium overflow-hidden">
                        {breadcrumbs.map((crumb, i) => (
                            <React.Fragment key={crumb.path}>
                                {i > 0 && <ChevronRight className="h-3.5 w-3.5 mx-2 text-muted-foreground shrink-0" />}
                                {i === breadcrumbs.length - 1 ? (
                                    <span className="text-foreground truncate">{crumb.label}</span>
                                ) : (
                                    <Link
                                        to={crumb.path}
                                        className="text-muted-foreground hover:text-foreground transition-colors truncate"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </header>

                {/* 内容主体 */}
                <main className="flex-1 overflow-y-auto p-6 bg-muted/5">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}