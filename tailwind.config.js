/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
      './src/components/fe/**/*.{js,ts,jsx,tsx}', // adjust if different
    ],
  theme: {
    extend: {
            fontFamily: {
              poppins: ['Poppins', 'sans-serif'],
              lobster: ['Lobster', 'cursive'],
              pacifico: ['Pacifico', 'cursive'],
              merriweather: ['Merriweather', 'serif'],
            },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
      }, 
  },
    plugins: [],
  }
}
  
  

