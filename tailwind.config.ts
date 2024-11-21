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
        card: 'repeat(auto-fill, minmax(14rem, 1fr))',
        'card-sm': 'repeat(auto-fill, minmax(16rem, 1fr))',
        'card-16rem': 'repeat(auto-fill, minmax(18rem, 1fr))',
      },
      dropShadow: {
        text: '0 1.2px 1.2px rgba(0, 0, 0, 0.8)',
      },
      colors: {
        primary: {
          '50': '#f3f7fb',
          '100': '#e3edf6',
          '200': '#cde1f0',
          '300': '#abcde5',
          '400': '#82b3d8',
          '500': '#6598cc',
          '600': '#497abc',
          '700': '#476eae',
          '800': '#3e5a8f',
          '900': '#364d72',
          '950': '#253046',
        },
        secondary: {
          '50': '#fdf6fb',
          '100': '#fbecf8',
          '200': '#f6d8f1',
          '300': '#eeb9e2',
          '400': '#e290ce',
          '500': '#d164b5',
          '600': '#a63f8a',
          '700': '#953679',
          '800': '#7a2e63',
          '900': '#652a51',
          '950': '#411132',
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
        shrinkRight: {
          '100%': { width: '0%', transform: 'translateX(-100%)' },
        },
        expandLeft: {
          '0%': { width: '50%', 'justify-content': 'center' },
          '100%': {
            width: '100%',
            'justify-content': 'center',
          },
        },
        expandRight: {
          '0%': { width: '50%', 'justify-content': 'center' },
          '100%': { width: '100%', 'justify-content': 'center' },
        },
        mobileShrinkTop: {
          '100%': { height: '0%', transform: 'translateY(100%)' },
        },
        mobileShrinkBottom: {
          '100%': { height: '0%', transform: 'translateY(-100%)' },
        },

        mobileExpandTop: {
          '0%': { height: '50%', 'justify-content': 'center' },
          '100%': { height: '100%', 'justify-content': 'center' },
        },
        mobileExpandBottom: {
          '0%': { height: '50%', 'justify-content': 'center' },
          '100%': { height: '100%', 'justify-content': 'center' },
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
