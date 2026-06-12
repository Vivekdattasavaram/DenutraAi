/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#009688', // Teal from Flutter
        secondary: '#00796b',
        accent: '#4db6ac',
        background: '#F5F7FA', // Background from Flutter
      },
    },
  },
  plugins: [],
}
