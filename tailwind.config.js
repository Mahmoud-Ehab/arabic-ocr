module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      keyframes: {
        letterDisappear: {
          '0%': {height: 300, width: 300},
          '100%': { 
            height: 0, 
            width: 0,
            opacity: 0, 
            padding: 0, 
            margin: 0 
          },
        }
      },

      animation: {
        letterDisappear: 'letterDisappear 1s ease-in-out forwards',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
