import { lazy } from 'react';

export const DashboardPage = lazy(() => import('../pages/Dashboard'));
export const HostsPage = lazy(() => import('../pages/Hosts'));
export const RegionsAzPage = lazy(() => import('../pages/RegionsAz'));
export const UsersPage = lazy(() => import('../pages/Users'));
export const OrgsPage = lazy(() => import('../pages/Orgs'));
export const SettingsPage = lazy(() => import('../pages/Settings'));
export const NotFoundPage = lazy(() => import('../pages/NotFound'));
export const ComingSoonPage = lazy(() => import('../pages/ComingSoon'));
export const ComponentsPage = lazy(() => import('../pages/Components'));
export const PageTemplateListPage = lazy(() => import('../pages/PageTemplates').then((module) => ({ default: module.PageTemplateListPage })));
export const PageTemplateDetailPage = lazy(() => import('../pages/PageTemplates').then((module) => ({ default: module.PageTemplateDetailPage })));
export const PageTemplateCreatePage = lazy(() => import('../pages/PageTemplates').then((module) => ({ default: module.PageTemplateCreatePage })));
export const PageTemplateSheetPage = lazy(() => import('../pages/PageTemplates').then((module) => ({ default: module.PageTemplateSheetPage })));
export const PageTemplateDialogPage = lazy(() => import('../pages/PageTemplates').then((module) => ({ default: module.PageTemplateDialogPage })));
export const PageTemplateStatsPage = lazy(() => import('../pages/PageTemplates').then((module) => ({ default: module.PageTemplateStatsPage })));
