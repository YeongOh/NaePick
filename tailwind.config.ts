import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
