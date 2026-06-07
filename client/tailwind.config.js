/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      colors: {
        primary: colors.blue[600],
        'primary-hover': colors.blue[700],
        background: colors.zinc[100],
        surface: colors.white,
        sidebar: colors.zinc[200],
        border: colors.zinc[300],
        'text-primary': colors.zinc[900],
        'text-secondary': colors.zinc[600],
        success: colors.emerald[500],
        warning: colors.amber[500],
        error: colors.red[500],
      },
    },
  },
  plugins: [],
};
