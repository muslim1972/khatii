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
        'xs': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0em' }],
        'sm': ['0.84rem', { lineHeight: '1.45', letterSpacing: '0em' }],
        'base': ['0.92rem', { lineHeight: '1.5', letterSpacing: '0em' }],
        'lg': ['1.05rem', { lineHeight: '1.45', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.35', letterSpacing: '-0.015em' }],
        '2xl': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '3xl': ['1.85rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
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
        bus: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          dark: '#B45309',
          subtle: '#FEF3C7',
          subtleDark: 'rgba(245, 158, 11, 0.16)',
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
