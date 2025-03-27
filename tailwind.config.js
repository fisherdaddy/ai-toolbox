/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#EEF2FF',
          500: '#6366F1',
          600: '#4F46E5',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

