/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          light: '#FAF5F0',
          medium: '#F1E6D9',
          dark: '#E6D5C3',
        },
        sun: '#F6DFCE',
        orangePastel: '#FBD4B4',
        terracotta: {
          DEFAULT: '#C86A4B',
          soft: '#E4A084',
          dark: '#B95B39',
        },
        earth: {
          dark: '#4E342E',
          muted: '#7A6A5D',
        },
      },
      fontFamily: {
        serif: ['"League Spartan Variable"', '"League Spartan"', 'Inter', 'sans-serif'],
        display: ['"League Spartan Variable"', '"League Spartan"', 'Inter', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: '0.35' },
          '50%': { transform: 'translateY(-30px) scale(1.06)', opacity: '0.55' },
        },
        'drift-slow': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'translate(40px, -25px) rotate(4deg)' },
          '66%': { transform: 'translate(-20px, 35px) rotate(-2deg)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 14s ease-in-out infinite',
        'drift-slow': 'drift-slow 30s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
