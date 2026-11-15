/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-readex-pro)',
          'var(--font-ibm-plex-arabic)',
          'var(--font-cairo)',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        display: [
          'var(--font-readex-pro)',
          'var(--font-plus-jakarta)',
          'sans-serif',
        ],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      fontSize: {
        'xs': [
          'clamp(0.75rem, 0.71rem + 0.18vw, 0.84rem)',
          { lineHeight: '1.6', letterSpacing: '0em' },
        ],
        'sm': [
          'clamp(0.875rem, 0.83rem + 0.22vw, 0.98rem)',
          { lineHeight: '1.65', letterSpacing: '0em' },
        ],
        'base': [
          'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
          { lineHeight: '1.75', letterSpacing: '0em' },
        ],
        'lg': [
          'clamp(1.25rem, 1.15rem + 0.45vw, 1.406rem)',
          { lineHeight: '1.55', letterSpacing: '-0.01em' },
        ],
        'xl': [
          'clamp(1.563rem, 1.40rem + 0.75vw, 1.758rem)',
          { lineHeight: '1.4', letterSpacing: '-0.015em' },
        ],
        '2xl': [
          'clamp(1.953rem, 1.72rem + 1.10vw, 2.197rem)',
          { lineHeight: '1.3', letterSpacing: '-0.02em' },
        ],
        '3xl': [
          'clamp(2.441rem, 2.10rem + 1.60vw, 2.747rem)',
          { lineHeight: '1.2', letterSpacing: '-0.025em' },
        ],
      },
      colors: {
        canvas: {
          light: '#F8FAFC',
          dark: '#0B0F19',
          subtle: '#F1F5F9',
          subtleDark: '#0F172A',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111827',
          glassLight: 'rgba(255, 255, 255, 0.88)',
          glassDark: 'rgba(17, 24, 39, 0.86)',
          borderLight: '#E2E8F0',
          borderDark: '#1E293B',
        },
        brand: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          active: '#1E40AF',
          subtle: '#EFF6FF',
          subtleDark: 'rgba(37, 99, 235, 0.16)',
        },
        safety: {
          DEFAULT: '#10B981',
          hover: '#059669',
          darkText: '#065F46',
          subtle: '#ECFDF5',
          subtleDark: 'rgba(16, 185, 129, 0.16)',
        },
        alert: {
          amber: '#D97706',
          amberSubtle: '#FFFBEB',
          crimson: '#DC2626',
          crimsonSubtle: '#FEF2F2',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#334155',
          muted: '#475569',
          inverse: '#F8FAFC',
          inverseMuted: '#94A3B8',
        },
      },
      boxShadow: {
        'ambient-sm':
          '0 1px 2px -1px rgba(15, 23, 42, 0.04), 0 2px 8px -2px rgba(15, 23, 42, 0.05)',
        'ambient-md':
          '0 4px 12px -2px rgba(15, 23, 42, 0.05), 0 12px 24px -4px rgba(15, 23, 42, 0.06)',
        'ambient-lg':
          '0 12px 32px -4px rgba(15, 23, 42, 0.07), 0 24px 48px -12px rgba(15, 23, 42, 0.09)',
        'ambient-brand':
          '0 8px 24px -4px rgba(37, 99, 235, 0.28), 0 2px 6px -1px rgba(37, 99, 235, 0.16)',
        'ambient-safety':
          '0 8px 24px -4px rgba(16, 185, 129, 0.26), 0 2px 6px -1px rgba(16, 185, 129, 0.14)',
      },
      borderRadius: {
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
      minHeight: {
        'touch': '48px',
        'touch-lg': '56px',
      },
      transitionTimingFunction: {
        'optical': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'gps-glide': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
