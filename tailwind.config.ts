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
      md: ['0.875rem', '1.25rem'],
      base: ['0.875rem', '1.25rem'],
      lg: ['1rem', '1.5rem'],
      xl: ['1.125rem', '1.5rem'],
      '2xl': ['1.25rem', '1.75rem'],
      '3xl': ['1.5rem', '2rem'],
      '4xl': ['1.875rem', '2.25rem'],
      '5xl': ['2.25rem', '2.5rem'],
      '6xl': ['3rem', '3.25rem'],
      '7xl': ['3.75rem', '4rem'],
    },
    extend: {
      extend: {
        transitionProperty: {
          width: 'width',
        },
      },
      colors: {
        primary: {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#000000',
        },
        bg: {
          '400': '#f7f7f9',
          '500': '#EBEEF1',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        moveLeft: {
          '100%': { transform: 'translateX(-100%)' },
        },
        moveRight: {
          '100%': { transform: 'translateX(100%)' },
        },
        pickLeft: {
          '100%': { transform: 'translateX(50%)' },
        },
        pickRight: {
          '100%': { transform: 'translateX(-50%)' },
        },
        // 버전 2
        shrinkLeft: {
          '100%': { width: '0%', transform: 'translateX(100%)' },
        },
        shrinkRight: {
          '100%': { width: '0%', transform: 'translateX(-100%)' },
        },
        expandRight: {
          '0%': { width: '50%', 'justify-content': 'center' },
          '100%': { width: '100%', 'justify-content': 'center' },
        },
        expandLeft: {
          // justify-content를 늦게 줘야 layout shifting이 안생김
          '0%': { width: '50%', 'justify-content': 'center' },
          '100%': {
            width: '100%',
            'justify-content': 'center',
          },
        },
      },
      animation: {
        moveLeft: 'moveLeft 0.5s ease-in-out forwards',
        moveRight: 'moveRight 0.5s ease-in-out forwards',
        pickLeft: 'pickLeft 0.75s ease-in-out forwards',
        pickRight: 'pickRight 0.75s ease-in-out forwards',
        // 버전 2
        shrinkLeft: 'shrinkLeft 0.4s ease-in-out forwards',
        shrinkRight: 'shrinkRight 0.4s ease-in-out forwards',
        expandLeft: 'expandLeft 0.5s ease-in-out forwards',
        expandRight: 'expandRight 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
