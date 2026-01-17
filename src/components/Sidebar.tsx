import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LogOut,
    ChevronsUpDown,
    ChevronDown,
    ChevronRight,
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
    Command,
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

    // State for menus
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    // State for Search
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<HTMLDivElement>(null);

    // State for Hovered Menu (Floating Submenu)
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    // Ref for Hover Timeout to prevent flickering/accidental closing
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Refs for click outside
    const menuRef = useRef<HTMLDivElement>(null);
    const themeMenuRef = useRef<HTMLDivElement>(null);

    // --- Dynamic Data Processing ---

    // 1. Generate Search Items from Router Config
    const searchItems = useMemo(() => {
        interface SearchItem {
            key: string;
            breadcrumbs: string[];
            desc?: string;
            icon: LucideIcon;
            path: string;
        }

        const appItems: SearchItem[] = [];

        const flattenRoutes = (routes: RouteConfig[], parentLabels: string[] = [], rootIcon?: LucideIcon) => {
            routes.forEach(route => {
                const currentBreadcrumbs = [...parentLabels, route.label];

                // Use passed rootIcon if available (for children), otherwise use current route's icon (for top-level)
                const displayIcon = rootIcon || route.icon || Box;

                if (route.component) {
                    appItems.push({
                        key: route.label,
                        breadcrumbs: currentBreadcrumbs,
                        icon: displayIcon,
                        path: route.path
                    });
                }
                if (route.children) {
                    flattenRoutes(route.children, currentBreadcrumbs, displayIcon);
                }
            });
        };
        flattenRoutes(navRoutes);

        return appItems;
    }, []);

    // Filtered items derived state
    const filteredItems = searchItems.filter(item =>
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.breadcrumbs.some((b: string) => b.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = (label: string) => {
        // If collapsed, clicking the parent icon shouldn't necessarily expand the sidebar anymore
        // It is handled by hover for submenu.
        if (isCollapsed) return;

        setExpandedMenus((prev) =>
            prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
        );
    };

    // --- Hover Handlers with Delay ---
    const handleMouseEnter = (label: string) => {
        // Clear any pending close timer when entering/re-entering
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }

        if (isCollapsed) {
            setHoveredMenu(label);
        }
    };

    const handleMouseLeave = () => {
        // Start a timer to close the menu. If the user enters the menu content
        // or goes back to the icon before this fires, it will be cleared.
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredMenu(null);
        }, 300); // 300ms delay gives enough time to cross the gap
    };

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((prev) => !prev);
            }
            if (e.key === "Escape") {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when search opens & Reset index
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [isSearchOpen]);

    // Scroll selected item into view
    useEffect(() => {
        if (selectedItemRef.current && scrollContainerRef.current) {
            selectedItemRef.current.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }, [selectedIndex]);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
                setIsThemeMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Auto-expand menu if child is active AND NOT collapsed
    useEffect(() => {
        if (isCollapsed) return;

        navRoutes.forEach((item) => {
            if (item.children) {
                // Simple check: if current pathname matches a child path exactly
                const hasActiveChild = item.children.some((child) => location.pathname === child.path);
                if (hasActiveChild) {
                    setExpandedMenus((prev) => {
                        if (!prev.includes(item.label)) return [...prev, item.label];
                        return prev;
                    });
                }
            }
        });
    }, [location.pathname, isCollapsed]);

    const handleSearchSelect = (item: typeof searchItems[0]) => {
        if (item.path) {
            navigate(item.path);
        }
        setIsSearchOpen(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (filteredItems.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchSelect(filteredItems[selectedIndex]);
        }
    };

    return (
        <>
            <aside
                className={cn(
                    "bg-background border-r flex flex-col z-20 flex-shrink-0 transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-[70px]" : "w-full md:w-64"
                )}
            >
                {/* 头部 Logo */}
                <div className={cn("flex items-center h-14 px-4", isCollapsed ? "justify-center" : "gap-3")}>
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <div className="h-3 w-3 bg-white/30 rounded-full" />
                    </div>
                    {!isCollapsed && <span className="text-lg font-bold tracking-tight">Acme Corp</span>}
                </div>

                {/* Quick Search Input */}
                <div className={cn("py-4 pb-2", isCollapsed ? "px-2" : "px-4")}>
                    {isCollapsed ? (
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-full h-10"
                            onClick={() => setIsSearchOpen(true)}
                            title="Search (Cmd+K)"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    ) : (
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/40 border border-input rounded-md hover:bg-muted/80 hover:text-foreground transition-all duration-200 group ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <Search className="h-4 w-4 group-hover:text-primary transition-colors" />
                            <span className="flex-1 text-left truncate">Quick search...</span>
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                    )}
                </div>

                {/* Dynamic Navigation Rendering */}
                <nav
                    className={cn(
                        "flex-1 p-4 space-y-1",
                        isCollapsed ? "overflow-visible" : "overflow-y-auto scrollbar-thin"
                    )}
                >
                    {navRoutes.map((item) => {
                        const Icon = item.icon || Box; // Fallback icon

                        // Render Parent Item with Children
                        if (item.children) {
                            const isExpanded = expandedMenus.includes(item.label) && !isCollapsed;
                            const isActiveParent = item.children.some(child => location.pathname === child.path);

                            return (
                                <div
                                    key={item.label}
                                    className="relative group"
                                    onMouseEnter={() => handleMouseEnter(item.label)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Button
                                        variant={isActiveParent ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full",
                                            isCollapsed ? "justify-center px-2" : "justify-between",
                                            isActiveParent && "font-semibold"
                                        )}
                                        onClick={() => toggleMenu(item.label)}
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        <div className="flex items-center">
                                            <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                                            {!isCollapsed && <span>{item.label}</span>}
                                        </div>
                                        {!isCollapsed && (
                                            isExpanded ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />
                                        )}
                                    </Button>

                                    {/* Expanded Submenu (Standard Vertical) */}
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
                                                            <ChildIcon className="mr-2 h-2 w-2" />
                                                            {child.label}
                                                        </Button>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Floating Submenu (Collapsed Hover State) */}
                                    {isCollapsed && hoveredMenu === item.label && (
                                        <div className="absolute left-full top-0 ml-2 w-48 rounded-md border bg-popover shadow-xl z-50 animate-in fade-in slide-in-from-left-2 duration-150">
                                            <div className="px-3 py-2 text-sm font-semibold text-foreground border-b bg-muted/20">
                                                {item.label}
                                            </div>
                                            <div className="p-1 flex flex-col gap-1">
                                                {item.children.map((child) => {
                                                    const isChildActive = location.pathname === child.path;
                                                    return (
                                                        <Link key={child.path} to={child.path} onClick={() => setHoveredMenu(null)}>
                                                            <div className={cn(
                                                                "flex items-center px-2 py-2 text-sm rounded-sm hover:bg-muted transition-colors cursor-pointer",
                                                                isChildActive && "bg-muted font-medium text-primary"
                                                            )}>
                                                                <span className="flex-1">{child.label}</span>
                                                                {isChildActive && <Check className="h-3 w-3" />}
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Render Single Item (Leaf node)
                        if (!item.component) return null;

                        const isActive = location.pathname === item.path;
                        return (
                            <div key={item.path} className="relative group">
                                <Link to={item.path}>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full",
                                            isCollapsed ? "justify-center px-2" : "justify-start",
                                            isActive && "font-semibold"
                                        )}
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                                        {!isCollapsed && item.label}
                                    </Button>
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                {/* Settings & Appearance */}
                <div className={cn("pb-2", isCollapsed ? "px-2" : "px-4")} ref={themeMenuRef}>
                    <div className="relative">
                        {isThemeMenuOpen && (
                            <div className={cn(
                                "absolute bottom-full mb-2 w-64 rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50",
                                isCollapsed ? "left-full ml-2" : "left-0"
                            )}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Theme</label>
                                        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg border border-border/50">
                                            {(['light', 'dark', 'system'] as const).map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => setTheme(t)}
                                                    className={cn(
                                                        "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                                                        theme === t
                                                            ? "bg-background shadow-sm text-foreground ring-1 ring-border"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                                    )}
                                                >
                                                    {t === 'light' && <Sun className="h-3.5 w-3.5" />}
                                                    {t === 'dark' && <Moon className="h-3.5 w-3.5" />}
                                                    {t === 'system' && <Monitor className="h-3.5 w-3.5" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accent Color</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {(['zinc', 'red', 'blue', 'green', 'orange'] as const).map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => setThemeColor(c)}
                                                    className={cn(
                                                        "group relative h-8 w-8 rounded-full border shadow-sm flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                                        themeColor === c ? "ring-2 ring-primary ring-offset-2" : ""
                                                    )}
                                                    title={c}
                                                >
                              <span
                                  className="absolute inset-0.5 rounded-full"
                                  style={{
                                      backgroundColor: c === 'zinc' ? '#18181b' : `hsl(${
                                          c === 'red' ? '0 72.2% 50.6%' :
                                              c === 'blue' ? '221.2 83.2% 53.3%' :
                                                  c === 'green' ? '142.1 76.2% 36.3%' :
                                                      '24.6 95% 53.1%'
                                      })`
                                  }}
                              />
                                                    {themeColor === c && <Check className="h-3 w-3 text-white z-10" strokeWidth={3} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full text-muted-foreground hover:text-foreground",
                                isThemeMenuOpen && "bg-muted text-foreground",
                                isCollapsed ? "justify-center px-2" : "justify-start"
                            )}
                            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                            title={isCollapsed ? "Appearance" : undefined}
                        >
                            <Palette className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                            {!isCollapsed && "Appearance"}
                        </Button>
                    </div>
                </div>

                {/* User Section at Bottom */}
                <div className="p-4 border-t bg-background relative" ref={menuRef}>
                    {isUserMenuOpen && (
                        <div className={cn(
                            "absolute bottom-full mb-2 rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200",
                            isCollapsed ? "left-full ml-2 w-48" : "left-4 right-4"
                        )}>
                            <div className="p-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center rounded-sm px-2 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full h-auto py-2 hover:bg-muted/50",
                            isCollapsed ? "justify-center px-0" : "justify-start px-2",
                            isUserMenuOpen && "bg-muted"
                        )}
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        title={isCollapsed ? currentUser?.name : undefined}
                    >
                        <div className={cn("flex items-center w-full", isCollapsed ? "justify-center" : "gap-3")}>
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{currentUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <>
                                    <div className="flex flex-col items-start flex-1 overflow-hidden">
                                        <span className="text-sm font-medium truncate w-full text-left">{currentUser?.name || 'Guest'}</span>
                                        <span className="text-xs text-muted-foreground truncate w-full text-left">{currentUser?.email || 'guest@example.com'}</span>
                                    </div>
                                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-50" />
                                </>
                            )}
                        </div>
                    </Button>
                </div>
            </aside>

            {/* Search Modal Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                        onClick={() => setIsSearchOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative z-50 w-full max-w-xl mx-4 bg-popover text-popover-foreground shadow-2xl rounded-xl border overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200">
                        <div className="flex items-center border-b px-4" >
                            <Search className="mr-3 h-5 w-5 text-muted-foreground" />
                            <input
                                ref={searchInputRef}
                                className="flex h-14 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Search products, pages and features..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                onKeyDown={handleInputKeyDown}
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-medium text-muted-foreground border rounded px-1.5 py-0.5 bg-muted">ESC</span>
                            </div>
                        </div>

                        <div
                            className="max-h-[60vh] overflow-y-auto p-2"
                            ref={scrollContainerRef}
                        >
                            {searchQuery === "" && (
                                <div className="px-2 py-2 text-xs font-semibold text-muted-foreground">Recent & Suggestions</div>
                            )}

                            <div className="space-y-1">
                                {filteredItems.map((item, index) => {
                                    const ItemIcon = item.icon;
                                    const isSelected = index === selectedIndex;

                                    return (
                                        <div
                                            key={item.key + index}
                                            ref={isSelected ? selectedItemRef : null}
                                            onClick={() => handleSearchSelect(item)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer group transition-colors",
                                                isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                                                    <ItemIcon className={cn("h-4 w-4 transition-colors", isSelected ? "text-primary" : "text-muted-foreground")} />
                                                </div>

                                                <div className="flex flex-col truncate">
                                                    {/* Main Path / Breadcrumbs */}
                                                    <div className="flex items-center gap-1.5 text-sm font-medium">
                                                        {item.breadcrumbs.map((crumb: string, i: number) => (
                                                            <React.Fragment key={i}>
                                                                {i > 0 && <span className="text-muted-foreground/50">›</span>}
                                                                <span className={cn(i === item.breadcrumbs.length - 1 ? "text-foreground" : "text-muted-foreground")}>
                                                  {crumb}
                                                </span>
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                    {/* Description */}
                                                    {item.desc && (
                                                        <span className={cn("text-xs transition-colors line-clamp-1", isSelected ? "text-accent-foreground/80" : "text-muted-foreground")}>
                                                {item.desc}
                                            </span>
                                                    )}
                                                </div>
                                            </div>
                                            <CornerDownLeft className={cn(
                                                "h-3.5 w-3.5 transition-all flex-shrink-0 ml-2",
                                                isSelected ? "opacity-50 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                                            )} />
                                        </div>
                                    );
                                })}
                                {filteredItems.length === 0 && (
                                    <div className="p-8 text-center text-sm text-muted-foreground">
                                        <Command className="mx-auto h-8 w-8 mb-3 opacity-20" />
                                        <p>No results found for "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t bg-muted/40 px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <ArrowUp className="h-3 w-3" />
                                    <ArrowDown className="h-3 w-3" />
                                    <span>to navigate</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CornerDownLeft className="h-3 w-3" />
                                    <span>to select</span>
                                </div>
                            </div>
                            <div>
                                <span className="opacity-70">Acme Search</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
