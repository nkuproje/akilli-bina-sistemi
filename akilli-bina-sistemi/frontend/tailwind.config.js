/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          950: '#0E0914',
          900: '#170F1F',
          850: '#1C1228',
          800: '#21172B',
          700: '#2D1F3A',
          600: '#3A2849',
          500: '#4A3560',
          400: '#6B4D8A',
          300: '#9B7DBB',
          200: '#C8B0DD',
          100: '#EDE5F7',
        },
        pink: {
          900: '#3D1030',
          800: '#6B1050',
          700: '#C01A6A',
          600: '#E02080',
          500: '#F545A0',
          400: '#FF6AB5',
          300: '#FF80C8',
          200: '#FFB0DC',
          100: '#FFE0F0',
        }
      }
    },
  },
  plugins: [],
}
