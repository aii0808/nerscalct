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
        sans: ['"Plus Jakarta Sans"', 'Nunito', 'sans-serif'],
      },
      colors: {
        neu: {
          bg: '#E6ECF2',
          darkBg: '#0A0D12',
          card: '#E6ECF2',
          darkCard: '#13171D',
          text: '#0F172A',
          darkText: '#F8FAFC',
          subtext: '#475569',
          darkSubtext: '#94A3B8',
        },
      },
      boxShadow: {
        'neu-flat': 'var(--neu-shadow-flat)',
        'neu-flat-sm': 'var(--neu-shadow-flat-sm)',
        'neu-flat-lg': 'var(--neu-shadow-flat-lg)',
        'neu-pressed': 'var(--neu-shadow-pressed)',
        'neu-pressed-sm': 'var(--neu-shadow-pressed-sm)',
        'neu-dark-pressed': 'inset 1px 2px 5px rgba(0, 0, 0, 0.85)',
        'neu-dark-pressed-sm': 'inset 1px 1px 3px rgba(0, 0, 0, 0.75)',
        'neu-dark-flat': '0 4px 16px rgba(0, 0, 0, 0.65)',
        'neu-dark-flat-sm': '0 2px 8px rgba(0, 0, 0, 0.55)',
      },
      keyframes: {
        drop: {
          '0%': { transform: 'scale(1) translateY(0)', opacity: '0.8' },
          '70%': { transform: 'scale(0.95) translateY(55px)', opacity: '1' },
          '100%': { transform: 'scale(1.4) translateY(65px)', opacity: '0' },
        },
        ripple: {
          '0%': { transform: 'scale(0.5)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'drop-fall': 'drop 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'water-ripple': 'ripple 1.2s ease-out infinite',
      }
    },
  },
  plugins: [],
}
