/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f7f6',
          100: '#e9e8e6',
          200: '#d3d1cd',
          300: '#b3afa8',
          400: '#8a8479',
          500: '#6b6459',
          600: '#534d44',
          700: '#3d3832',
          800: '#252220',
          900: '#15130f',
          950: '#0a0908',
        },
        gold: {
          50: '#fbf8f0',
          100: '#f4ecd8',
          200: '#e8d6ab',
          300: '#dabd7c',
          400: '#cda255',
          500: '#b8863e',
          600: '#9a6c30',
          700: '#7a5527',
          800: '#5c4020',
          900: '#42301a',
        },
        cream: {
          50: '#fdfcfa',
          100: '#faf8f4',
          200: '#f5f1e8',
        },
        success: '#2f6f4f',
        danger: '#a3342e',
        info: '#2c4a63',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.04em' }],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(15,13,9,0.08)',
        elevated: '0 12px 40px -8px rgba(15,13,9,0.18)',
        gold: '0 8px 30px -6px rgba(184,134,62,0.35)',
        'inner-line': 'inset 0 -1px 0 0 rgba(0,0,0,0.06)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      maxWidth: {
        '8xl': '1440px',
      },
      backgroundImage: {
        'shimmer-gradient':
          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')],
}
