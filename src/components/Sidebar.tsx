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
    Box, type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useStore } from '../store/useStore';
import { navRoutes, type RouteConfig } from '@/lib/routes';

interface SearchItem {
    key: string;
    desc: string;
    icon?: LucideIcon;
    path: string;
}

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout, theme, setTheme, themeColor, setThemeColor } = useStore();

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

    // Refs for click outside
    const menuRef = useRef<HTMLDivElement>(null);
    const themeMenuRef = useRef<HTMLDivElement>(null);

    // --- Dynamic Data Processing ---

    // 1. Generate Search Items from Router Config
    const searchItems = useMemo(() => {
        const appItems: SearchItem[] = [];

        const flattenRoutes = (routes: RouteConfig[]) => {
            routes.forEach(route => {
                if (route.component) {
                    appItems.push({
                        key: route.label,
                        desc: `Go to ${route.label}`,
                        icon: route.icon,
                        path: route.path
                    });
                }
                if (route.children) {
                    flattenRoutes(route.children);
                }
            });
        };
        flattenRoutes(navRoutes);

        return [...appItems];
    }, []);

    // Filtered items derived state
    const filteredItems = searchItems.filter(item =>
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = (label: string) => {
        setExpandedMenus((prev) =>
            prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
        );
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
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
        if (!isSearchOpen) {
            setSearchQuery("");
        }
        setSelectedIndex(0);
    }, [isSearchOpen, searchQuery]);

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

    // Auto-expand menu if child is active
    useEffect(() => {
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
    }, [location.pathname]);

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
            <aside className="w-full md:w-64 bg-background border-r flex flex-col z-20 flex-shrink-0 transition-colors duration-300">
                <div className="p-6 border-b flex items-center gap-2">
                    <div className="h-6 w-6 bg-primary rounded-full transition-colors duration-300" />
                    <h1 className="text-lg font-bold tracking-tight">Acme Corp</h1>
                </div>

                {/* Quick Search Input */}
                <div className="px-4 py-4 pb-2">
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
                </div>

                {/* Dynamic Navigation Rendering */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navRoutes.map((item) => {
                        const Icon = item.icon || Box; // Fallback icon

                        // Render Parent Item with Children
                        if (item.children) {
                            const isExpanded = expandedMenus.includes(item.label);
                            // Check if any child is active
                            const isActiveParent = item.children.some(child => location.pathname === child.path);

                            return (
                                <div key={item.label} className="space-y-1">
                                    <Button
                                        variant={isActiveParent ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-between",
                                            isActiveParent && "font-semibold"
                                        )}
                                        onClick={() => toggleMenu(item.label)}
                                    >
                                        <div className="flex items-center">
                                            <Icon className="mr-2 h-4 w-4" />
                                            {item.label}
                                        </div>
                                        {isExpanded ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
                                    </Button>

                                    {/* Submenu with vertical guide line */}
                                    {isExpanded && (
                                        <div className="ml-6 mt-1 border-l border-border pl-2 space-y-1">
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
                                </div>
                            );
                        }

                        // Render Single Item (Leaf node)
                        // Ensure we don't render single items that don't have components or are just grouping containers without children
                        if (!item.component) return null;

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

                {/* Settings & Appearance */}
                <div className="px-4 pb-2" ref={themeMenuRef}>
                    <div className="relative">
                        {isThemeMenuOpen && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
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
                                                    <span className="capitalize">{t}</span>
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
                            className={cn("w-full justify-start text-muted-foreground hover:text-foreground", isThemeMenuOpen && "bg-muted text-foreground")}
                            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                        >
                            <Palette className="mr-2 h-4 w-4" />
                            Appearance
                        </Button>
                    </div>
                </div>

                {/* User Section at Bottom */}
                <div className="p-4 border-t bg-background relative" ref={menuRef}>
                    {isUserMenuOpen && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
                            <div className="p-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center rounded-sm px-2 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </button>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start h-auto py-2 px-2 hover:bg-muted/50",
                            isUserMenuOpen && "bg-muted"
                        )}
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <div className="flex items-center gap-3 w-full">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{currentUser?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start flex-1 overflow-hidden">
                                <span className="text-sm font-medium truncate w-full text-left">{currentUser?.name || 'Guest'}</span>
                                <span className="text-xs text-muted-foreground truncate w-full text-left">{currentUser?.email || 'guest@example.com'}</span>
                            </div>
                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-50" />
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
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                <div className="px-2 py-2 text-xs font-semibold text-muted-foreground">Search tips</div>
                            )}

                            <div className="space-y-1">
                                {filteredItems.map((item, index) => {
                                    const ItemIcon = item.icon;
                                    const isSelected = index === selectedIndex;

                                    return (
                                        <div
                                            key={item.key}
                                            ref={isSelected ? selectedItemRef : null}
                                            onClick={() => handleSearchSelect(item)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-3 rounded-md cursor-pointer group transition-colors",
                                                isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-3 min-w-[120px]">
                                                    {ItemIcon && (
                                                        <ItemIcon
                                                            className={cn("h-4 w-4 transition-colors", isSelected ? "text-primary" : "text-muted-foreground")}
                                                        />
                                                    )}
                                                    <span className="font-medium text-sm">{item.key}:</span>
                                                </div>
                                                <span className={cn("text-sm transition-colors", isSelected ? "text-accent-foreground/90" : "text-muted-foreground group-hover:text-accent-foreground/80")}>{item.desc}</span>
                                            </div>
                                            <CornerDownLeft className={cn(
                                                "h-3.5 w-3.5 transition-all",
                                                isSelected ? "opacity-50 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                                            )} />
                                        </div>
                                    );
                                })}
                                {filteredItems.length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No results found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t bg-muted/40 px-4 py-2.5 flex items-center justify-start gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <ArrowUp className="h-3 w-3" />
                                <ArrowDown className="h-3 w-3" />
                                <span>to navigate</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CornerDownLeft className="h-3 w-3" />
                                <span>to select</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
