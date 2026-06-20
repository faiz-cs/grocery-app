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
        // Deep charcoal/ink surfaces (not pure black — premium feel)
        ink: {
          50: '#f4f5f7',
          100: '#e6e8ec',
          200: '#c7cbd4',
          300: '#9aa1b0',
          400: '#6b7280',
          500: '#4b5160',
          600: '#363b47',
          700: '#262a33',
          800: '#1a1d24',
          900: '#121419',
          950: '#0a0b0e',
        },
        // Vivid lime-emerald accent (premium grocery brand color)
        lime: {
          50: '#f3fce8',
          100: '#e3f8c9',
          200: '#c8f098',
          300: '#a3e25c',
          400: '#82d130',
          500: '#65b81e',
          600: '#4d9217',
          700: '#3b7016',
          800: '#325917',
          900: '#2b4b17',
        },
        // Warm amber for deals/offers
        flame: {
          400: '#ff9f4a',
          500: '#ff7a1a',
          600: '#f25e00',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
