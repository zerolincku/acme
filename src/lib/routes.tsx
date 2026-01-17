import React, { lazy } from 'react';
import {
    LayoutDashboard,
    Users,
    Settings,
    Circle,
    type LucideIcon
} from 'lucide-react';
import NotFound from "@/pages/NotFound.tsx";

// Lazy load pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const UsersPage = lazy(() => import('../pages/Users'));
const SettingsPage = lazy(() => import('../pages/Settings'));

// Type definition for route configuration
export type RouteConfig = {
    path: string;
    label: string;
    icon?: LucideIcon;
    component?: React.ComponentType; // component to render
    children?: RouteConfig[];
};

// Main Navigation Routes (Used for Sidebar and App Routing)
export const navRoutes: RouteConfig[] = [
    {
        path: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        component: Dashboard,
    },
    {
        path: '/management', // Unique parent path
        label: 'Management',
        icon: Users,
        children: [
            {
                path: '/management/users',
                label: 'User List',
                icon: Circle,
                component: UsersPage
            },
            {
                path: '/management/groups',
                label: 'User Groups',
                icon: Circle,
                component: NotFound
            }
        ]
    },
    {
        path: '/system', // Unique parent path
        label: 'System',
        icon: Settings,
        children: [
            {
                path: '/system/settings',
                label: 'General Settings',
                icon: Circle,
                component: SettingsPage
            },
            {
                path: '/system/security',
                label: 'Security',
                icon: Circle,
                component: NotFound
            }
        ]
    }
];
