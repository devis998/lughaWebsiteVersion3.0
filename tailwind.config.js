/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef0ff',
          100: '#e0e3ff',
          200: '#c7ccfe',
          300: '#a5acfc',
          400: '#8286f8',
          500: '#4A4E9E',
          600: '#3d4182',
          700: '#33366a',
          800: '#2b2e58',
          900: '#252749',
        },
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
    },
  },
  plugins: [],
};
