/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0A0F0D', // Deep, dark teal
        'secondary': '#1C2B27', // Lighter teal for cards
        'accent': '#D4A15D', // Muted, elegant amber/gold
        'text-primary': '#EAEAEA', // Off-white
        'text-secondary': '#8A9B96', // Muted grey-green
        'glass': 'rgba(28, 43, 39, 0.5)', // For glassmorphism
      },
      fontFamily: {
        'display': ['"Bebas Neue"', 'sans-serif'],
        'serif': ['"Cormorant Garamond"', 'serif'],
        'sans': ['"Inter"', 'sans-serif'],
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}