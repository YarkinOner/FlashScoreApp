/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'bg-main': '#0A0E17',
        'bg-card': '#171E2E',
        'primary-blue': '#3B82F6',
        'accent-cyan': '#22D3EE',
      },
    },
  },
  plugins: [],
}