import { useEffect } from 'react';
import { useStore, type ThemeColor } from '@/store/useStore';

export default function ThemeController() {
    const { theme, themeColor } = useStore();

    // Handle Light/Dark/System Mode
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    // Handle Theme Colors
    useEffect(() => {
        const root = window.document.documentElement;

        // HSL Color Definitions
        const colors: Record<ThemeColor, string> = {
            zinc: "240 5.9% 10%", // Default Shadcn zinc
            red: "0 72.2% 50.6%",
            blue: "221.2 83.2% 53.3%",
            green: "142.1 76.2% 36.3%",
            orange: "24.6 95% 53.1%",
        };

        if (themeColor === 'zinc') {
            // Reset to default stylesheet values (handles dark/light zinc swap automatically)
            root.style.removeProperty('--primary');
            root.style.removeProperty('--primary-foreground');
            root.style.removeProperty('--ring');
        } else {
            // Enforce specific color for primary elements
            root.style.setProperty('--primary', colors[themeColor]);
            root.style.setProperty('--primary-foreground', '0 0% 100%'); // White text for colored buttons
            root.style.setProperty('--ring', colors[themeColor]);
        }
    }, [themeColor]);

    return null;
}
