import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LogOut,
    ChevronsUpDown,
    ChevronDown,
    Palette,
    Sun,
    Moon,
    Monitor,
    Check,
    Search,
    ArrowUp,
    ArrowDown,
    CornerDownLeft,
    Box,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useStore } from '../store/useStore';
import { navRoutes, type RouteConfig } from '../lib/routes';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout, theme, setTheme, themeColor, setThemeColor, isSidebarCollapsed: isCollapsed } = useStore();

    // 菜单状态
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    // 搜索状态
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<HTMLDivElement>(null);

    // 悬浮提示状态 (用于折叠模式)
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 引用
    const userMenuRef = useRef<HTMLDivElement>(null);
    const themeMenuRef = useRef<HTMLDivElement>(null);

    // 生成搜索项
    const searchItems = useMemo(() => {
        const appItems: { key: string; breadcrumbs: string[]; icon: LucideIcon; path: string }[] = [];
        const flattenRoutes = (routes: RouteConfig[], parentLabels: string[] = [], rootIcon?: LucideIcon) => {
            routes.forEach(route => {
                const currentBreadcrumbs = [...parentLabels, route.label];
                const displayIcon = rootIcon || route.icon || Box;
                if (route.component) {
                    appItems.push({ key: route.label, breadcrumbs: currentBreadcrumbs, icon: displayIcon, path: route.path });
                }
                if (route.children) {
                    flattenRoutes(route.children, currentBreadcrumbs, displayIcon);
                }
            });
        };
        flattenRoutes(navRoutes);
        return appItems;
    }, []);

    const filteredItems = searchItems.filter(item =>
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.breadcrumbs.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // 搜索控制逻辑
    const openSearch = () => {
        setIsSearchOpen(true);
        setSelectedIndex(0);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSelectedIndex(0);
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const toggleMenu = (label: string) => {
        if (isCollapsed) return;
        setExpandedMenus(prev => prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]);
    };

    // 悬浮逻辑处理
    const handleMouseEnter = (label: string) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        if (isCollapsed) setHoveredMenu(label);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => setHoveredMenu(null), 200);
    };

    // 快捷键
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openSearch(); }
            if (e.key === "Escape") closeSearch();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // 自动聚焦
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [isSearchOpen]);

    // 滚动选中项
    useEffect(() => {
        if (selectedItemRef.current && scrollContainerRef.current) {
            selectedItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [selectedIndex]);

    // 点击外部关闭
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setIsUserMenuOpen(false);
            if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) setIsThemeMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // 自动展开激活项
    useEffect(() => {
        if (isCollapsed) return;
        navRoutes.forEach(item => {
            if (item.children?.some(child => location.pathname === child.path)) {
                setExpandedMenus(prev => prev.includes(item.label) ? prev : [...prev, item.label]);
            }
        });
    }, [location.pathname, isCollapsed]);

    return (
        <>
            <aside className={cn(
                "bg-background border-r flex flex-col z-30 flex-shrink-0 transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[65px]" : "w-64"
            )}>
                {/* 头部 Logo */}
                <div className={cn("flex items-center h-14 px-4", isCollapsed ? "justify-center" : "gap-3")}>
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <div className="h-3 w-3 bg-white/30 rounded-full" />
                    </div>
                    {!isCollapsed && <span className="text-lg font-bold tracking-tight">Acme Corp</span>}
                </div>

                {/* 快速搜索框 */}
                <div
                    className="px-4 py-4 pb-2 relative"
                    onMouseEnter={() => handleMouseEnter('Quick Search')}
                    onMouseLeave={handleMouseLeave}
                >
                    <button
                        onClick={openSearch}
                        className={cn(
                            "w-full flex items-center bg-muted/40 border border-transparent rounded-lg transition-all hover:bg-muted/60",
                            isCollapsed ? "justify-center h-9" : "px-3 py-2 gap-2"
                        )}
                    >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        {!isCollapsed && (
                            <>
                                <span className="text-sm text-muted-foreground flex-1 text-left">Quick search...</span>
                                <div className="border rounded px-1.5 py-0.5 bg-background text-[10px] text-muted-foreground font-mono">⌘K</div>
                            </>
                        )}
                    </button>
                    {/* 折叠模式提示框 */}
                    {isCollapsed && hoveredMenu === 'Quick Search' && (
                        <div className="absolute left-[calc(100%-8px)] top-4 ml-2 px-3 py-1.5 rounded-md border bg-popover shadow-xl z-50 text-xs font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-1 pointer-events-none">
                            Quick Search <span className="ml-1 opacity-50 font-mono">⌘K</span>
                        </div>
                    )}
                </div>

                {/* 主导航 - 核心修改：折叠时 overflow-visible 允许悬浮框溢出 */}
                <nav className={cn(
                    "flex-1 px-3 space-y-1 mt-2",
                    isCollapsed ? "overflow-visible" : "overflow-y-auto scrollbar-none"
                )}>
                    {navRoutes.map((item) => {
                        const Icon = item.icon || Box;
                        const isExpanded = expandedMenus.includes(item.label) && !isCollapsed;
                        const isActiveParent = item.children?.some(child => location.pathname === child.path);

                        return (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => handleMouseEnter(item.label)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {item.children ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full h-10 transition-all",
                                                isCollapsed ? "justify-center px-0" : "justify-between px-3",
                                                isActiveParent && !isExpanded && "bg-accent/40 font-semibold"
                                            )}
                                            onClick={() => toggleMenu(item.label)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={cn("h-5 w-5", isActiveParent ? "text-primary" : "text-muted-foreground")} />
                                                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                                            </div>
                                            {!isCollapsed && (
                                                <ChevronDown className={cn("h-4 w-4 transition-transform text-muted-foreground", !isExpanded && "-rotate-90")} />
                                            )}
                                        </Button>

                                        {/* 子菜单 - 常规展开 */}
                                        {isExpanded && !isCollapsed && (
                                            <div className="ml-6 mt-1 border-l border-border pl-2 space-y-1 animate-in slide-in-from-top-1 fade-in duration-200">
                                                {item.children.map((child) => {
                                                    const ChildIcon = child.icon || Box;
                                                    const isChildActive = location.pathname === child.path;
                                                    return (
                                                        <Link key={child.path} to={child.path}>
                                                            <Button
                                                                variant={isChildActive ? "secondary" : "ghost"}
                                                                size="sm"
                                                                className={cn(
                                                                    "w-full justify-start pl-4 h-9",
                                                                    isChildActive && "bg-muted font-medium"
                                                                )}
                                                            >
                                                                <ChildIcon className={cn("mr-2 h-2 w-2", isChildActive ? "text-primary" : "text-muted-foreground")} />
                                                                {child.label}
                                                            </Button>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* 子菜单 - 折叠模式悬浮 */}
                                        {isCollapsed && hoveredMenu === item.label && (
                                            <div className="absolute left-[calc(100%-8px)] top-0 ml-2 w-48 rounded-xl border bg-popover shadow-xl z-50 animate-in fade-in slide-in-from-left-2 duration-150 py-1 overflow-hidden">
                                                <div className="px-3 py-2 text-xs font-bold text-muted-foreground border-b bg-muted/20 uppercase tracking-tight">
                                                    {item.label}
                                                </div>
                                                <div className="p-1 flex flex-col gap-1">
                                                    {item.children.map((child) => {
                                                        const isChildActive = location.pathname === child.path;
                                                        return (
                                                            <Link key={child.path} to={child.path} onClick={() => setHoveredMenu(null)}>
                                                                <div className={cn(
                                                                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                                                                    isChildActive ? "bg-accent text-accent-foreground font-semibold" : "hover:bg-accent/50"
                                                                )}>
                                                                    <span className="flex-1">{child.label}</span>
                                                                    {isChildActive && <Check className="h-3 w-3 text-primary" />}
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Link to={item.path}>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-full h-10",
                                                    isCollapsed ? "justify-center px-0" : "justify-start px-3",
                                                    location.pathname === item.path && "bg-accent text-accent-foreground font-semibold"
                                                )}
                                            >
                                                <Icon className={cn("h-5 w-5", location.pathname === item.path ? "text-primary" : "text-muted-foreground")} />
                                                {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                                            </Button>
                                        </Link>
                                        {/* 单一页面折叠模式提示 */}
                                        {isCollapsed && hoveredMenu === item.label && (
                                            <div className="absolute left-[calc(100%-8px)] top-1 ml-2 px-3 py-1.5 rounded-md border bg-popover shadow-xl z-50 text-xs font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-1 pointer-events-none">
                                                {item.label}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* 外观设置 */}
                <div
                    className="px-3 py-2 border-t relative"
                    ref={themeMenuRef}
                    onMouseEnter={() => handleMouseEnter('Appearance')}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="relative">
                        {isThemeMenuOpen && (
                            <div className={cn(
                                "absolute bottom-full mb-2 w-64 rounded-xl border bg-popover p-4 shadow-xl z-50 animate-in zoom-in-95 duration-200",
                                isCollapsed ? "left-[calc(100%-8px)] ml-2" : "left-0"
                            )}>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Theme Mode</label>
                                        <div className="flex gap-1 bg-muted/40 p-1 rounded-lg">
                                            {(['light', 'dark', 'system'] as const).map((t) => (
                                                <Button
                                                    key={t}
                                                    variant={theme === t ? 'secondary' : 'ghost'}
                                                    size="icon"
                                                    className="h-8 w-full"
                                                    onClick={() => setTheme(t)}
                                                >
                                                    {t === 'light' && <Sun className="h-4 w-4" />}
                                                    {t === 'dark' && <Moon className="h-4 w-4" />}
                                                    {t === 'system' && <Monitor className="h-4 w-4" />}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Accent Color</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {(['zinc', 'red', 'blue', 'green', 'orange'] as const).map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => setThemeColor(c)}
                                                    className={cn("h-6 w-6 rounded-full border shadow-sm transition-transform hover:scale-110 flex items-center justify-center", themeColor === c && "ring-2 ring-primary ring-offset-2")}
                                                    style={{ backgroundColor: c === 'zinc' ? '#18181b' : `hsl(${c === 'red' ? '0 72% 50%' : c === 'blue' ? '221 83% 53%' : c === 'green' ? '142 76% 36%' : '24 95% 53%'})` }}
                                                >
                                                    {themeColor === c && <Check className="h-3 w-3 text-white" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            className={cn("w-full h-10 text-muted-foreground hover:text-foreground", isCollapsed ? "justify-center px-0" : "justify-start px-3")}
                            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                        >
                            <Palette className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span className="ml-3 text-sm font-medium">Appearance</span>}
                        </Button>
                    </div>
                    {/* 外观提示 */}
                    {isCollapsed && hoveredMenu === 'Appearance' && !isThemeMenuOpen && (
                        <div className="absolute left-[calc(100%-8px)] top-2 ml-2 px-3 py-1.5 rounded-md border bg-popover shadow-xl z-50 text-xs font-medium whitespace-nowrap animate-in fade-in slide-in-from-left-1 pointer-events-none">
                            Appearance
                        </div>
                    )}
                </div>

                {/* 用户信息 */}
                <div className={cn("border-t bg-background relative transition-all", isCollapsed ? "p-2" : "p-3")} ref={userMenuRef}>
                    {isUserMenuOpen && (
                        <div className={cn(
                            "absolute bottom-full mb-2 rounded-xl border bg-popover shadow-2xl z-50 animate-in slide-in-from-bottom-2 duration-200 overflow-hidden",
                            isCollapsed ? "left-[calc(100%-8px)] ml-1 w-48" : "left-2 right-2"
                        )}>
                            <div className="p-1">
                                <div className="px-3 py-2 border-b mb-1">
                                    <p className="text-sm font-bold truncate">{currentUser?.name}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{currentUser?.email}</p>
                                </div>
                                <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                    <LogOut className="h-4 w-4" /> Sign out
                                </button>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        className={cn("w-full h-14 p-0 rounded-xl", isCollapsed ? "justify-center" : "px-2 justify-between")}
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3 overflow-hidden text-left")}>
                            <Avatar className="h-9 w-9 rounded-lg shrink-0">
                                <AvatarFallback className="rounded-lg bg-indigo-500 text-white font-bold text-xs uppercase">{currentUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-bold truncate">{currentUser?.name}</span>
                                    <span className="text-[11px] text-muted-foreground truncate">{currentUser?.email}</span>
                                </div>
                            )}
                        </div>
                        {!isCollapsed && <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-50 shrink-0" />}
                    </Button>
                </div>
            </aside>

            {/* 搜索模态框 */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={closeSearch} />
                    <div className="relative w-full max-w-xl mx-4 bg-popover rounded-xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center border-b px-4">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <input
                                autoFocus
                                ref={searchInputRef}
                                className="h-14 w-full bg-transparent px-3 outline-none text-base font-medium"
                                placeholder="Search pages and management..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(p => (p + 1) % (filteredItems.length || 1)); }
                                    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(p => (p - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1)); }
                                    if (e.key === 'Enter' && filteredItems[selectedIndex]) {
                                        navigate(filteredItems[selectedIndex].path);
                                        closeSearch();
                                    }
                                }}
                            />
                            <div className="flex items-center gap-1.5 border rounded px-1.5 py-0.5 bg-muted text-[10px] text-muted-foreground font-mono">ESC</div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-2" ref={scrollContainerRef}>
                            {filteredItems.map((item, idx) => (
                                <div
                                    key={item.path + idx}
                                    ref={idx === selectedIndex ? selectedItemRef : null}
                                    onClick={() => { navigate(item.path); closeSearch(); }}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-colors",
                                        idx === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn("h-4 w-4", idx === selectedIndex ? "text-primary" : "text-muted-foreground")} />
                                        <div className="flex items-center gap-1.5 text-sm font-medium">
                                            {item.breadcrumbs.map((c, i) => (
                                                <React.Fragment key={i}>
                                                    {i > 0 && <span className="opacity-30">›</span>}
                                                    <span className={i === item.breadcrumbs.length - 1 ? "" : "opacity-60 text-xs"}>{c}</span>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                    {idx === selectedIndex && <CornerDownLeft className="h-3.5 w-3.5 opacity-40" />}
                                </div>
                            ))}
                            {filteredItems.length === 0 && (
                                <div className="py-12 text-center text-sm text-muted-foreground">No results found for "{searchQuery}"</div>
                            )}
                        </div>
                        <div className="bg-muted/30 border-t px-4 py-3 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" /><ArrowDown className="h-3 w-3" /> Navigate</span>
                                <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> Select</span>
                            </div>
                            <span>Acme Command Center</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
