import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
      },
      animation: {
        moveLeft: 'moveLeft 0.5s ease-in-out forwards',
        moveRight: 'moveRight 0.5s ease-in-out forwards',
        pickLeft: 'pickLeft 0.75s ease-in-out forwards',
        pickRight: 'pickRight 0.75s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
