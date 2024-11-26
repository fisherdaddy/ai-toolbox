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
    // 注意：line-clamp 现在已经内置在 Tailwind CSS v3.3+ 中
    // 不需要额外的插件了
  ],
}

