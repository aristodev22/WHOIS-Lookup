const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  purge:{ 
    enabled: true,
    content: ["public/index.html"]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
    'xs': '426px',
    ...defaultTheme.screens,
    },
    extend: {}, 
    fontFamily: {
      'Inter': ['Inter', 'sans-serif']
     }   
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
