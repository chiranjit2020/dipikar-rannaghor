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
        // Dark-first premium palette
        base: '#0b0b0f',
        surface: {
          DEFAULT: '#141419',
          2: '#1b1b22',
          3: '#23232c',
        },
        hairline: 'rgba(255,255,255,0.08)',
        ink: {
          DEFAULT: '#f4f4f5',
          soft: '#a1a1aa',
          muted: '#71717a',
        },
        saffron: {
          DEFAULT: '#f5a623',
          soft: '#ffb84d',
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
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 30px -12px rgba(0,0,0,0.6)',
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
