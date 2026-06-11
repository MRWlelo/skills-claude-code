/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#111113',
          2: '#18181b',
          3: '#212125',
          4: '#2a2a2f',
        },
        border: '#2e2e33',
        primary: {
          DEFAULT: '#16c784',
          dark: '#0fa870',
          light: '#2fe0a0',
        },
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
