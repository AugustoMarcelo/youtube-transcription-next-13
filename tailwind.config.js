/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#9705ea',
        },
        neutral: {
          background: '#030712',
          surface: {
            primary: '#111827',
            secondary: '#1f2937',
            tertiary: '#374151',
          },
        },
        tipography: {
          primary: '#f9fafb',
          secondary: '#e5e7eb',
          tertiary: '#9ca3af',
        },
      },
      fontSize: {
        none: {
          fontSize: '0px',
        },
      },
      dropShadow: {
        default: '0 0 16px rgba(151, 5, 234, 0.5)',
        hover: '0 0 32px rgba(151, 5, 234, 1)',
      },
    },
  },
  plugins: [],
};
