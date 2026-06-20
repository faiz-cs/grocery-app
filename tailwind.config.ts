import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep forest green — Instacart's primary brand color
        forest: {
          50: '#f0f7f0',
          100: '#dcebdc',
          200: '#b8d6b9',
          300: '#8cba8e',
          400: '#5c9a60',
          500: '#3f7d43',
          600: '#2f6332',
          700: '#0aad0a',
          800: '#1e3d20',
          900: '#0d2e0f',
          950: '#0a2c0c',
        },
        // Carrot orange — Instacart's signature accent
        carrot: {
          50: '#fff4ed',
          100: '#ffe6d5',
          200: '#ffc9aa',
          300: '#ffa274',
          400: '#ff7038',
          500: '#ff7009',
          600: '#f25700',
          700: '#c84102',
          800: '#9f3409',
          900: '#802d0a',
        },
        // Warm cream surface (not pure white)
        cream: {
          50: '#fefdfb',
          100: '#fdf9f3',
        },
      },
    },
  },
  plugins: [],
}

export default config
