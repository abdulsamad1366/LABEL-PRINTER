/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stitch: {
          bg: '#081425',
          panel: '#152031',
          card: '#1f2a3c',
          border: '#2a3548',
          text: '#d8e3fb',
          muted: '#8c909f',
          accent: '#3b82f6',
          teal: '#29a195',
          canvas: '#f8fafc'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
