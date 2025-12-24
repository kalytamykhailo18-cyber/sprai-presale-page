/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom green/nature colors from existing site
        'sprai-green': '#3E7C47',
        'sprai-brown': '#5C3A21',
        'sprai-gold': '#FFD700',
        'sprai-dark-green': '#2E8B57',
      },
    },
  },
  plugins: [],
}
