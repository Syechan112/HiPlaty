/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#2563eb',
        'primary-dark': '#1d4ed8',
        'neutral-light': '#9ca3af',
        'neutral-dark': '#1f2937',
        'bg-app': '#f8f9fc',
      },
    },
  },
  plugins: [],
}
