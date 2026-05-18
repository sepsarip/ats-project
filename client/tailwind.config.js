/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.blue[600],
        'primary-hover': colors.blue[700],
        background: colors.zinc[50],
        surface: colors.white,
        sidebar: colors.zinc[100],
        border: colors.zinc[200],
        'text-primary': colors.zinc[900],
        'text-secondary': colors.zinc[500],
        success: colors.emerald[500],
        warning: colors.amber[500],
        error: colors.red[500],
      },
    },
  },
  plugins: [],
};
