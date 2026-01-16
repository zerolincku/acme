import React, { lazy } from 'react';
import {
    LayoutDashboard,
    Users,
    Settings,
    Shield,
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
        path: '/users', // Parent path for grouping
        label: 'Management',
        icon: Users,
        children: [
            {
                path: '/users', // This renders at /users (index of parent) or we can use exact matching logic
                label: 'User List',
                icon: Circle,
                component: UsersPage
            },
            // Example of another child route, reusing UsersPage for demo or a different page
            {
                path: '/users/groups',
                label: 'User Groups',
                icon: Circle,
                component: NotFound // Reusing for demo, ideally would be GroupsPage
            }
        ]
    },
    {
        path: '/settings',
        label: 'System',
        icon: Settings,
        children: [
            {
                path: '/settings',
                label: 'General Settings',
                icon: Circle,
                component: SettingsPage
            },
            {
                path: '/settings/security',
                label: 'Security',
                icon: Shield,
                component: NotFound // Reusing for demo
            }
        ]
    }
];
