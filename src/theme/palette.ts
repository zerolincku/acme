export const THEME_COLORS = ['zinc', 'red', 'blue', 'green', 'orange'] as const;

export type ThemeColor = (typeof THEME_COLORS)[number];

export const THEME_PRIMARY_HSL: Record<ThemeColor, string> = {
  zinc: '240 5.9% 10%',
  red: '0 72.2% 50.6%',
  blue: '221.2 83.2% 53.3%',
  green: '142.1 76.2% 36.3%',
  orange: '24.6 95% 53.1%',
};

export const THEME_PRIMARY_FOREGROUND_HSL: Record<ThemeColor, string> = {
  zinc: '0 0% 98%',
  red: '0 0% 100%',
  blue: '0 0% 100%',
  green: '0 0% 100%',
  orange: '0 0% 100%',
};

export const THEME_SWATCH_COLOR: Record<ThemeColor, string> = {
  zinc: 'hsl(240 5.9% 10%)',
  red: 'hsl(0 72.2% 50.6%)',
  blue: 'hsl(221.2 83.2% 53.3%)',
  green: 'hsl(142.1 76.2% 36.3%)',
  orange: 'hsl(24.6 95% 53.1%)',
};
