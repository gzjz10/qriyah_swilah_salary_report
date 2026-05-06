import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#C8963E',
          light: '#E8B86D',
          dark: '#8B6419',
        },
        dark: {
          1: '#0A0E1A',
          2: '#111827',
          3: '#1A2236',
          4: '#222D42',
        },
        card: {
          DEFAULT: '#1C2638',
          2: '#243044',
        },
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};

export default config;
