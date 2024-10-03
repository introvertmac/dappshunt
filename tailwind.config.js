// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        coinbase: {
          blue: '#0052FF',
          darkBlue: '#05195A',
          lightBlue: '#E9F0FF',
          green: '#05B169',
        },
      },
    },
  },
  plugins: [],
};
