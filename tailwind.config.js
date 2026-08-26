/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2D5C',
          dark: '#0B2248',
          light: '#1B3E75',
        },
        brand: {
          DEFAULT: '#2563EB',
          50: '#EFF4FF',
          100: '#DBE6FE',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
      },
      maxWidth: {
        'container-max': '1280px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(15, 45, 92, 0.06), 0 10px 24px rgba(15, 45, 92, 0.05)',
        card: '0 1px 2px rgba(15, 45, 92, 0.04), 0 4px 12px rgba(15, 45, 92, 0.04)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
}
