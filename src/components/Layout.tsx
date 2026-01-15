import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

function Layout() {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/settings', label: 'Settings', icon: SettingsIcon },
    ];

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-muted/20">
            {/* Sidebar / Navbar */}
            <aside className="w-full md:w-64 bg-background border-r flex flex-col">
                <div className="p-6 border-b flex items-center gap-2">
                    <div className="h-6 w-6 bg-primary rounded-full" />
                    <h1 className="text-lg font-bold tracking-tight">Acme Corp</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn("w-full justify-start", isActive && "font-semibold")}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                            U
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">User</p>
                            <p className="text-xs text-muted-foreground">user@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
