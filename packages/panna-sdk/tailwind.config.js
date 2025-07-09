const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./ui/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans]
      }
    }
  },
  plugins: []
};
