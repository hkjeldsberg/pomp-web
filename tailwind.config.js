/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens: {
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1920px',
    },
    extend: {
      colors: {
        'bg-base': '#071412',
        'bg-surface': '#0D1F1D',
        'bg-card': '#112826',
        'text-primary': '#E0F5F0',
        'accent': '#20D2AA',
        'accent-muted': '#5DCAA5',
        'border-teal': 'rgba(32, 210, 170, 0.15)',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
