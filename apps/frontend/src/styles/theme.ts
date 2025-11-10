/**
 * Tokens de diseño del tema hotelMinimal
 * Estos valores están sincronizados con tailwind.config.js
 */
export const theme = {
  colors: {
    primary: '#C0A888',
    primaryFocus: '#A8926F',
    primaryContent: '#FFFFFF',
    base100: '#FFFFFF',
    base200: '#F5F5F5',
    base300: '#E5E5E5',
    baseContent: '#1F2937',
    accent: '#1E3A5F',
    accentFocus: '#152A47',
    accentContent: '#FFFFFF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
} as const

