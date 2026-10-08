/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        panel: '14px',
        control: '10px',
      },
      colors: {
        accent: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          light: '#3b82f6',
          muted: '#60a5fa',
        },
        surface: {
          light: 'rgba(255, 255, 255, 0.55)',
          lightDense: 'rgba(255, 255, 255, 0.82)',
          lightModal: 'rgba(255, 255, 255, 0.72)',
          dark: 'rgba(18, 24, 34, 0.55)',
          darkDense: 'rgba(18, 24, 34, 0.82)',
          darkModal: 'rgba(18, 24, 34, 0.72)',
        }
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 23, 42, 0.10)',
        'glass-hover': '0 12px 36px 0 rgba(15, 23, 42, 0.14)',
      }
    },
  },
  plugins: [],
}
