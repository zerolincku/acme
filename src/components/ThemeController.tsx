import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { THEME_PRIMARY_HSL, THEME_PRIMARY_FOREGROUND_HSL } from '@/theme/palette';

export default function ThemeController() {
    const { theme, themeColor } = useStore(
        useShallow((store) => ({
            theme: store.theme,
            themeColor: store.themeColor,
        })),
    );

    // Handle Light/Dark/System Mode
    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (isDark: boolean, currentTheme: string) => {
            root.classList.remove("light", "dark");
            if (currentTheme === "system") {
                root.classList.add(isDark ? "dark" : "light");
            } else {
                root.classList.add(currentTheme);
            }
        };

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            if (theme === "system") {
                applyTheme(e.matches, theme);
            }
        };

        applyTheme(mediaQuery.matches, theme);

        if (theme === "system") {
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    // Handle Theme Colors
    useEffect(() => {
        const root = window.document.documentElement;

        if (themeColor === 'zinc') {
            root.style.removeProperty('--primary');
            root.style.removeProperty('--primary-foreground');
            root.style.removeProperty('--ring');
            root.style.removeProperty('--sidebar-primary');
            return;
        }

        const hsl = THEME_PRIMARY_HSL[themeColor];
        const fgHsl = THEME_PRIMARY_FOREGROUND_HSL[themeColor];

        root.style.setProperty('--primary', hsl);
        root.style.setProperty('--primary-foreground', fgHsl);
        root.style.setProperty('--ring', hsl);
        root.style.setProperty('--sidebar-primary', hsl);
    }, [themeColor]);

    return null;
}
