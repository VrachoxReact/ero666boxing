/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#E02C2C',
          '50': '#F9D1D1',
          '100': '#F6BFBF',
          '200': '#F09A9A',
          '300': '#EA7575',
          '400': '#E55050',
          '500': '#E02C2C',
          '600': '#B81E1E',
          '700': '#891616',
          '800': '#5A0F0F',
          '900': '#2B0707',
        },
        'secondary': {
          DEFAULT: '#1F2937',
          '50': '#637A99',
          '100': '#5B7191',
          '200': '#4C5F7A',
          '300': '#3E4D63',
          '400': '#2F3B4C',
          '500': '#1F2937',
          '600': '#0F1722',
          '700': '#00050D',
          '800': '#000000',
          '900': '#000000',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'custom-lg': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
        'highlight': '0 0 15px rgba(224, 44, 44, 0.5)',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
        '5000': '5000ms',
        '10000': '10000ms',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'ripple': 'ripple 1s linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: 1 },
          '100%': { transform: 'scale(4)', opacity: 0 },
        },
      },
      blur: {
        'xs': '2px',
        '3xl': '64px',
        '4xl': '96px',
      },
      backdropBlur: {
        'xs': '2px',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

