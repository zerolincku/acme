import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="flex h-screen w-full flex-col md:flex-row bg-muted/20 overflow-hidden">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
