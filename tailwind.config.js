/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          hover: '#E65A00',
          light: '#FF8533',
        },
        dark: {
          DEFAULT: '#1A1A1A',
          lighter: '#2A2A2A',
          card: '#242424',
        },
        light: {
          DEFAULT: '#FFFFFF',
          bg: '#F8F9FA',
          border: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
