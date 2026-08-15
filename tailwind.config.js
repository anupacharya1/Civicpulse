/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 60% — warm light neutral background
        sand: {
          50: '#fbf9f5',
          100: '#f6f2ea',
          200: '#ece5d6',
          300: '#ddd2bb',
          400: '#c4b694',
          500: '#a8996f',
        },
        // 30% — muted deep teal/navy
        ink: {
          50: '#eef4f5',
          100: '#d6e4e6',
          200: '#aec9cd',
          300: '#7ea7ae',
          400: '#4f818b',
          500: '#356873',
          600: '#27545e',
          700: '#1f444d',
          800: '#193539',
          900: '#13282b',
          950: '#0c1a1c',
        },
        // 10% — restrained warm amber accent
        amber: {
          50: '#fdf6ec',
          100: '#f9e8c8',
          200: '#f2d08c',
          300: '#e9b45a',
          400: '#df9d36',
          500: '#c8821f',
          600: '#a5661a',
          700: '#824e17',
        },
        // supporting semantic ramps
        success: {
          50: '#edf7ef',
          100: '#d4ebd9',
          500: '#3e8d57',
          600: '#2f7345',
          700: '#245a36',
        },
        warning: {
          50: '#fdf6ec',
          500: '#c8821f',
          600: '#a5661a',
        },
        danger: {
          50: '#fbeceb',
          100: '#f5d4d2',
          500: '#c0504a',
          600: '#a23f3a',
          700: '#82322e',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(19, 40, 43, 0.08), 0 1px 3px -1px rgba(19, 40, 43, 0.06)',
        'soft-lg': '0 8px 30px -6px rgba(19, 40, 43, 0.12), 0 2px 8px -2px rgba(19, 40, 43, 0.08)',
        'soft-xl': '0 20px 50px -12px rgba(19, 40, 43, 0.18)',
        inset: 'inset 0 1px 2px rgba(19, 40, 43, 0.06)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'slide-in': 'slide-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
        'pulse-ring': 'pulse-ring 2.4s ease-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
