import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      sm: ['0.75rem', '1rem'],
      md: ['0.825rem', '1.35rem'],
      base: ['0.85rem', '1.25rem'],
      lg: ['0.95rem', '1.5rem'],
      xl: ['1.125rem', '1.5rem'],
      '2xl': ['1.25rem', '1.75rem'],
      '3xl': ['1.5rem', '2rem'],
      '4xl': ['1.875rem', '2.25rem'],
      '5xl': ['2.25rem', '2.5rem'],
      '6xl': ['3rem', '3.25rem'],
      '7xl': ['3.75rem', '4rem'],
      clamp: 'clamp(1.2rem, 1.4vw + 1.2rem, 2.2rem)',
      '2clamp': 'clamp(1.3rem, 1.4vw + 1.6rem, 2.8rem)',
      '3clamp': 'clamp(2.5rem, 1.4vw + 2.2rem, 4rem)',
    },
    extend: {
      gridTemplateColumns: {
        'card-12rem': 'repeat(auto-fill, minmax(12rem, 1fr))',
        'card-14rem': 'repeat(auto-fill, minmax(14rem, 1fr))',
        'card-16rem': 'repeat(auto-fill, minmax(16rem, 1fr))',
        'card-18rem': 'repeat(auto-fill, minmax(18rem, 1fr))',
        'category-12rem': 'repeat(auto-fill, minmax(12rem, 1fr))',
      },

      extend: {
        transitionProperty: {
          width: 'width',
        },
      },
      colors: {
        primary: {
          '50': '#f0f5fe',
          '100': '#dde9fc',
          '200': '#c3d8fa',
          '300': '#9ac1f6',
          '400': '#6aa0f0',
          '500': '#5587eb',
          '600': '#3260de',
          '700': '#2a4dcb',
          '800': '#283fa5',
          '900': '#253983',
          '950': '#1b2550',
        },
        bg: {
          '400': '#f7f7f9',
          '500': '#EBEEF1',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        shrinkLeft: {
          '100%': { width: '0%', transform: 'translateX(100%)' },
        },
        mobileShrinkTop: {
          '100%': { height: '0%', transform: 'translateY(100%)' },
        },
        mobileShrinkBottom: {
          '100%': { height: '0%', transform: 'translateY(-100%)' },
        },
        shrinkRight: {
          '100%': { width: '0%', transform: 'translateX(-100%)' },
        },
        expandRight: {
          '0%': { width: '50%', 'justify-content': 'center' },
          '100%': { width: '100%', 'justify-content': 'center' },
        },
        mobileExpandTop: {
          '0%': { height: '50%', 'justify-content': 'center' },
          '100%': { height: '100%', 'justify-content': 'center' },
        },
        mobileExpandBottom: {
          '0%': { height: '50%', 'justify-content': 'center' },
          '100%': { height: '100%', 'justify-content': 'center' },
        },
        expandLeft: {
          '0%': { width: '50%', 'justify-content': 'center' },
          '100%': {
            width: '100%',
            'justify-content': 'center',
          },
        },
        modalTransition: {
          '0%': { opacity: '0' },
          '100%': { opacity: '100' },
        },
      },
      animation: {
        shrinkLeft: 'shrinkLeft 0.4s ease-in-out forwards',
        shrinkRight: 'shrinkRight 0.4s ease-in-out forwards',
        expandLeft: 'expandLeft 0.5s ease-in-out forwards',
        expandRight: 'expandRight 0.5s ease-in-out forwards',
        mobileExpandTop: 'mobileExpandTop 0.3s ease-in-out forwards',
        mobileExpandBottom: 'mobileExpandBottom 0.3s ease-in-out forwards',
        mobileShrinkTop: 'mobileShrinkTop 0.3s ease-in-out forwards',
        mobileShrinkBottom: 'mobileShrinkBottom 0.3s ease-in-out forwards',
        modalTransition: 'modalTransition 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
