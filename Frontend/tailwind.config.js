/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          green: {
            light: '#e8f5e9',
            DEFAULT: '#2e7d32', // Forest Green
            dark: '#1b5e20',
          },
          gold: {
            DEFAULT: '#ffd700',
            dark: '#b8860b',
          },
          amber: {
            DEFAULT: '#ffbf00',
            dark: '#d97706',
          },
          darkBg: '#070b08', // Ultra-dark green/black base
          darkCard: '#101912', // Sleek card color
          glass: 'rgba(46, 125, 50, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
