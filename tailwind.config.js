/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
      'moroccan-gold': '#daa520',
      'moroccan-red': '#d7263d',
      },
       boxShadow: {
      'gold': '0 10px 24px 0 rgba(218,165,32,0.13), 0 1.5px 4px 0 rgba(218,165,32,0.07)'
    },

    },
  },
  plugins: [],
}

