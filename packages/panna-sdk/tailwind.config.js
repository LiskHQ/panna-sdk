const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./react/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans]
      }
    }
  },
  plugins: []
};
