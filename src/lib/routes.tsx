import React from 'react';
import {
    LayoutDashboard,
    Server,
    Users,
    Settings,
    Circle,
    Component,
    PanelsTopLeft,
    type LucideIcon
} from 'lucide-react';
import {
    DashboardPage,
    HostsPage,
    OrgsPage,
    RegionsAzPage,
    SettingsPage,
    UsersPage,
    ComponentsPage,
    ComingSoonPage,
    PageTemplateCreatePage,
    PageTemplateDetailPage,
    PageTemplateDialogPage,
    PageTemplateListPage,
    PageTemplateSheetPage,
    PageTemplateStatsPage,
} from '@/lib/route-components';
import { ROUTE_PATHS } from '@/config/paths';

// Type definition for route configuration
export type RouteConfig = {
    path: string;
    label: string;
    labelKey: string;
    icon?: LucideIcon;
    component?: React.ComponentType; // component to render
    children?: RouteConfig[];
};

export const findRouteWithParents = (
    routes: RouteConfig[],
    targetPath: string,
    parents: RouteConfig[] = [],
): { route: RouteConfig; ancestors: RouteConfig[] } | null => {
    for (const route of routes) {
        if (route.path === targetPath) {
            return { route, ancestors: parents };
        }
        if (route.children) {
            const found = findRouteWithParents(route.children, targetPath, [...parents, route]);
            if (found) {
                return found;
            }
        }
    }
    return null;
};

// Main Navigation Routes (Used for Sidebar and App Routing)
export const navRoutes: RouteConfig[] = [
    {
        path: ROUTE_PATHS.DASHBOARD,
        label: 'Dashboard',
        labelKey: 'nav.dashboard',
        icon: LayoutDashboard,
        component: DashboardPage,
    },
    {
        path: ROUTE_PATHS.INFRASTRUCTURE,
        label: 'Infrastructure',
        labelKey: 'nav.infrastructure',
        icon: Server,
        children: [
            {
                path: ROUTE_PATHS.HOST_LIST,
                label: 'Host List',
                labelKey: 'nav.hostList',
                icon: Circle,
                component: HostsPage
            },
            {
                path: ROUTE_PATHS.REGIONS_AZS,
                label: 'Regions & AZs',
                labelKey: 'nav.regionsAzs',
                icon: Circle,
                component: RegionsAzPage,
            },
            {
                path: ROUTE_PATHS.VMS,
                label: 'Virtual Machines',
                labelKey: 'nav.virtualMachines',
                icon: Circle,
                component: ComingSoonPage
            },
            {
                path: ROUTE_PATHS.STORAGE_POOLS,
                label: 'Storage Pools',
                labelKey: 'nav.storagePools',
                icon: Circle,
                component: ComingSoonPage
            },
        ]
    },
    {
        path: ROUTE_PATHS.MANAGEMENT,
        label: 'Management',
        labelKey: 'nav.management',
        icon: Users,
        children: [
            {
                path: ROUTE_PATHS.USER_LIST,
                label: 'User List',
                labelKey: 'nav.userList',
                icon: Circle,
                component: UsersPage,
            },
            {
                path: ROUTE_PATHS.ORG_LIST,
                label: 'Org List',
                labelKey: 'nav.orgList',
                icon: Circle,
                component: OrgsPage,
            },
            {
                path: ROUTE_PATHS.USER_GROUPS,
                label: 'User Groups',
                labelKey: 'nav.userGroups',
                icon: Circle,
                component: ComingSoonPage,
            },
        ],
    },
    {
        path: ROUTE_PATHS.SYSTEM, // Unique parent path
        label: 'System',
        labelKey: 'nav.system',
        icon: Settings,
        children: [
            {
                path: ROUTE_PATHS.SETTINGS,
                label: 'General Settings',
                labelKey: 'nav.generalSettings',
                icon: Circle,
                component: SettingsPage
            },
            {
                path: ROUTE_PATHS.SECURITY,
                label: 'Security',
                labelKey: 'nav.security',
                icon: Circle,
                component: ComingSoonPage
            }
        ]
    },
    {
        path: ROUTE_PATHS.COMPONENTS,
        label: 'Components',
        labelKey: 'nav.components',
        icon: Component,
        component: ComponentsPage,
    },
    {
        path: ROUTE_PATHS.PAGE_TEMPLATES,
        label: 'Page Templates',
        labelKey: 'nav.pageTemplates',
        icon: PanelsTopLeft,
        component: PageTemplateListPage,
        children: [
            {
                path: ROUTE_PATHS.PAGE_TEMPLATE_LIST,
                label: 'List Page',
                labelKey: 'nav.pageTemplateList',
                icon: Circle,
                component: PageTemplateListPage,
            },
            {
                path: ROUTE_PATHS.PAGE_TEMPLATE_DETAIL,
                label: 'Detail Page',
                labelKey: 'nav.pageTemplateDetail',
                icon: Circle,
                component: PageTemplateDetailPage,
            },
            {
                path: ROUTE_PATHS.PAGE_TEMPLATE_CREATE,
                label: 'Create Page',
                labelKey: 'nav.pageTemplateCreate',
                icon: Circle,
                component: PageTemplateCreatePage,
            },
            {
                path: ROUTE_PATHS.PAGE_TEMPLATE_SHEET,
                label: 'Drawer Page',
                labelKey: 'nav.pageTemplateSheet',
                icon: Circle,
                component: PageTemplateSheetPage,
            },
            {
                path: ROUTE_PATHS.PAGE_TEMPLATE_DIALOG,
                label: 'Modal Page',
                labelKey: 'nav.pageTemplateDialog',
                icon: Circle,
                component: PageTemplateDialogPage,
            },
            {
                path: ROUTE_PATHS.PAGE_TEMPLATE_STATS,
                label: 'Analytics Page',
                labelKey: 'nav.pageTemplateStats',
                icon: Circle,
                component: PageTemplateStatsPage,
            },
        ],
    }
];
