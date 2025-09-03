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
        'bg': 'hsl(214, 30%, 10%)',
        'accent': 'hsl(280, 50%, 60%)',
        'primary': 'hsl(210, 80%, 50%)',
        'surface': 'hsl(214, 30%, 15%)',
        'text-primary': 'hsl(0, 0%, 90%)',
        'text-secondary': 'hsl(0, 0%, 60%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 80%, 50%, 0.1)',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
      },
      fontSize: {
        'display': ['2.25rem', { fontWeight: 'bold' }],
        'h1': ['1.875rem', { fontWeight: 'semibold' }],
        'h2': ['1.5rem', { fontWeight: 'semibold' }],
        'body': ['1rem', { lineHeight: '1.75rem' }],
        'caption': ['0.875rem', { color: 'hsl(0, 0%, 60%)' }],
      },
      transitionTimingFunction: {
        'ease': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      transitionDuration: {
        'base': '200ms',
        'fast': '100ms',
        'slow': '300ms',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  plugins: [],
};

export default config;
