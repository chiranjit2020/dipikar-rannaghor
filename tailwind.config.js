/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Theme-aware tokens — values live in :root / :root.dark in index.css.
        base: 'rgb(var(--c-base) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--c-surface) / <alpha-value>)',
          2: 'rgb(var(--c-surface-2) / <alpha-value>)',
          3: 'rgb(var(--c-surface-3) / <alpha-value>)',
        },
        hairline: 'var(--hairline)',
        ink: {
          DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)',
          soft: 'rgb(var(--c-ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--c-ink-muted) / <alpha-value>)',
        },
        // Neutral overlay: white on dark, black on light. Use `tint/[0.04]` etc.
        tint: 'rgb(var(--c-tint) / <alpha-value>)',
        saffron: {
          DEFAULT: '#f5a623',
          soft: 'rgb(var(--c-saffron-soft) / <alpha-value>)',
          deep: '#e08600',
        },
        good: '#34d399',
        warn: '#fbbf24',
        bad: '#f87171',
        info: '#60a5fa',
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        glow: '0 0 0 1px rgba(245,166,35,0.25), 0 10px 40px -12px rgba(245,166,35,0.35)',
      },
      fontSize: {
        // Slightly larger than conventional dashboard sizing
        xs: ['0.8125rem', { lineHeight: '1.15rem' }],
        sm: ['0.9375rem', { lineHeight: '1.4rem' }],
        base: ['1.0625rem', { lineHeight: '1.75rem' }],
        lg: ['1.1875rem', { lineHeight: '1.8rem' }],
        xl: ['1.375rem', { lineHeight: '1.9rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.15rem' }],
        '3xl': ['2.15rem', { lineHeight: '2.5rem' }],
      },
    },
  },
  plugins: [],
};
