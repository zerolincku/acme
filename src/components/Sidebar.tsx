import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ChevronRight,
    Cloud,
    Check,
    Search,
    Box,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { navRoutes, type RouteConfig } from '../lib/routes';
import {
    Sidebar as SidebarRoot,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from './ui/sidebar';

import { ThemePicker } from './ThemePicker';
import { UserMenu } from './UserMenu';
import { CommandPalette } from './CommandPalette';
import { useKeyboardShortcut } from '../hooks/use-keyboard-shortcut';

export default function Sidebar() {
    const { t } = useTranslation();
    const location = useLocation();
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [collapsedMenuPath, setCollapsedMenuPath] = useState<string | null>(null);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const lastFocusedElementRef = useRef<HTMLElement | null>(null);

    const getRouteLabel = (route: RouteConfig) => t(route.labelKey, { defaultValue: route.label });

    const openSearch = () => {
        lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setIsSearchOpen(true);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        window.setTimeout(() => {
            lastFocusedElementRef.current?.focus();
        }, 0);
    };

    const toggleMenu = (key: string) => {
        if (isCollapsed) {
            setCollapsedMenuPath((prev) => (prev === key ? null : key));
            return;
        }
        setCollapsedMenuPath(null);
        setExpandedMenus((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
    };

    useKeyboardShortcut('k', openSearch, { ctrlOrMetaKey: true, preventDefault: true });

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-collapsed-menu-root="true"]')) setCollapsedMenuPath(null);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        if (isCollapsed) return;
        navRoutes.forEach((item) => {
            if (item.children && (location.pathname === item.path || item.children.some((child) => location.pathname === child.path))) {
                setExpandedMenus((prev) => (prev.includes(item.path) ? prev : [...prev, item.path]));
            }
        });
    }, [location.pathname, isCollapsed]);

    return (
        <>
            <SidebarRoot collapsible="icon" variant="sidebar" className="border-r">
                <SidebarHeader className="px-3 pt-3 pb-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pt-3">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                className="h-10 gap-2.5 px-2 text-sidebar-foreground hover:bg-transparent active:bg-transparent group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                            >
                                <div className="h-8 w-8 shrink-0 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5">
                                    <Cloud className="h-full w-full text-primary" />
                                </div>
                                <span className="text-[18px] font-semibold tracking-tight whitespace-nowrap group-data-[collapsible=icon]:hidden">{t('app.brand')}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem className="mt-3 group-data-[collapsible=icon]:mt-2">
                            <SidebarMenuButton
                                onClick={openSearch}
                                tooltip={t('sidebar.quickSearch')}
                                className="h-10 gap-2.5 rounded-lg border border-sidebar-border/80 bg-background px-3 text-sidebar-foreground/75 shadow-none hover:bg-background hover:text-sidebar-foreground dark:bg-sidebar-accent/35 dark:hover:bg-sidebar-accent/60 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:px-0"
                            >
                                <Search className="h-5 w-5 shrink-0 text-sidebar-foreground/70" />
                                <span className="whitespace-nowrap truncate font-medium group-data-[collapsible=icon]:hidden">{t('sidebar.quickSearchPlaceholder')}</span>
                                <span className="ml-auto rounded-md border border-sidebar-border bg-sidebar px-1.5 py-0.5 text-[10px] text-sidebar-foreground/60 font-mono group-data-[collapsible=icon]:hidden">⌘K</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent className="px-2.5 pb-2 group-data-[collapsible=icon]:px-2">
                    <SidebarMenu>
                        {navRoutes.map((item) => {
                            const Icon = item.icon || Box;
                            const isExpanded = expandedMenus.includes(item.path) && !isCollapsed;
                            const isActiveParent = item.children
                                ? location.pathname === item.path || item.children.some((child) => location.pathname === child.path)
                                : false;
                            const itemLabel = getRouteLabel(item);

                            if (item.children) {
                                return (
                                    <SidebarMenuItem key={item.path} data-collapsed-menu-root="true">
                                        <SidebarMenuButton
                                            onClick={() => toggleMenu(item.path)}
                                            isActive={isActiveParent}
                                            tooltip={itemLabel}
                                            className="h-10 rounded-lg px-2.5 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:px-0 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-normal"
                                        >
                                            <Icon className={cn('h-[18px] w-[18px] shrink-0', isActiveParent && 'text-primary')} />
                                            <span className="truncate">{itemLabel}</span>
                                            <ChevronRight className={cn('ml-auto h-4 w-4 transition-transform group-data-[collapsible=icon]:hidden', isExpanded && 'rotate-90', isActiveParent && 'text-primary')} />
                                        </SidebarMenuButton>

                                        <SidebarMenuSub className={cn('mx-4 my-1 border-l border-sidebar-border/80 px-2.5 py-1', !isExpanded && 'hidden')}>
                                            {item.children.map((child) => {
                                                const childLabel = getRouteLabel(child);
                                                const isChildActive = location.pathname === child.path;
                                                return (
                                                    <SidebarMenuSubItem key={child.path}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={isChildActive}
                                                            className="!h-9 rounded-md px-2 data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:hover:bg-transparent"
                                                        >
                                                            <Link to={child.path}>
                                                                <span
                                                                    className={cn(
                                                                        'h-2.5 w-2.5 shrink-0 rounded-full border',
                                                                        isChildActive
                                                                            ? 'border-primary bg-primary/20'
                                                                            : 'border-sidebar-foreground/45 bg-transparent',
                                                                    )}
                                                                />
                                                                <span className="truncate">{childLabel}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>

                                        {isCollapsed && collapsedMenuPath === item.path && (
                                            <div className="absolute left-full top-0 ml-2 w-56 rounded-xl border bg-popover shadow-xl z-50 overflow-hidden">
                                                <div className="px-3 py-2 text-xs font-bold text-muted-foreground border-b bg-muted/20 uppercase tracking-tight">
                                                    {itemLabel}
                                                </div>
                                                <div className="p-2">
                                                    {item.children.map((child) => {
                                                        const isChildActive = location.pathname === child.path;
                                                        const childLabel = getRouteLabel(child);
                                                        return (
                                                            <Link
                                                                key={child.path}
                                                                to={child.path}
                                                                onClick={() => setCollapsedMenuPath(null)}
                                                                className={cn(
                                                                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                                                                    isChildActive ? 'text-primary' : 'hover:bg-accent/50',
                                                                )}
                                                            >
                                                                <span
                                                                    className={cn(
                                                                        'h-2.5 w-2.5 shrink-0 rounded-full border',
                                                                        isChildActive
                                                                            ? 'border-primary bg-primary/20'
                                                                            : 'border-muted-foreground/40 bg-transparent',
                                                                    )}
                                                                />
                                                                <span className="flex-1">{childLabel}</span>
                                                                {isChildActive && <Check className="h-3 w-3 text-primary" />}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </SidebarMenuItem>
                                );
                            }

                            return (
                                <SidebarMenuItem key={item.path}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.path}
                                        tooltip={itemLabel}
                                        className="h-10 rounded-lg px-2.5 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-normal"
                                    >
                                        <Link to={item.path} onClick={() => setCollapsedMenuPath(null)}>
                                            <Icon className={cn('h-[18px] w-[18px] shrink-0', location.pathname === item.path && 'text-primary')} />
                                            <span className="truncate">{itemLabel}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter className="border-t px-2.5 py-2 group-data-[collapsible=icon]:px-2">
                    <ThemePicker isCollapsed={isCollapsed} />
                    <UserMenu isCollapsed={isCollapsed} />
                </SidebarFooter>
            </SidebarRoot>

            <CommandPalette isOpen={isSearchOpen} onClose={closeSearch} />
        </>
    );
}
