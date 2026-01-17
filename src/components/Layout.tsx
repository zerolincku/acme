import React, { useMemo } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { PanelLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { navRoutes, type RouteConfig } from '../lib/routes';

export default function Layout() {
    const { toggleSidebar } = useStore();
    const location = useLocation();

    // 深度查找当前路由及其祖先
    const breadcrumbs = useMemo(() => {
        const findRouteWithParents = (
            routes: RouteConfig[],
            targetPath: string,
            parents: RouteConfig[] = []
        ): { route: RouteConfig, ancestors: RouteConfig[] } | null => {
            for (const route of routes) {
                if (route.path === targetPath) {
                    return { route, ancestors: parents };
                }
                if (route.children) {
                    const found = findRouteWithParents(route.children, targetPath, [...parents, route]);
                    if (found) return found;
                }
            }
            return null;
        };

        const matchResult = findRouteWithParents(navRoutes, location.pathname);

        if (!matchResult) {
            return [{ label: 'Dashboard', path: '/', isLink: false }];
        }

        const crumbs = matchResult.ancestors.map(a => ({
            label: a.label,
            path: a.path,
            // 只有定义了组件的路由才是有效链接
            isLink: !!a.component && a.path !== location.pathname
        }));

        crumbs.push({
            label: matchResult.route.label,
            path: matchResult.route.path,
            isLink: false // 当前页面不作为链接
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
                            <React.Fragment key={crumb.path + i}>
                                {i > 0 && <ChevronRight className="h-3.5 w-3.5 mx-2 text-muted-foreground shrink-0" />}
                                {crumb.isLink ? (
                                    <Link
                                        to={crumb.path}
                                        className="text-muted-foreground hover:text-foreground transition-colors truncate"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className={i === breadcrumbs.length - 1 ? "text-foreground truncate" : "text-muted-foreground cursor-default truncate"}>
                    {crumb.label}
                  </span>
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
