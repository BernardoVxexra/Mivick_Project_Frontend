/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#F85200',
        background: '#1F1E1E', // Baseado no fundo escuro do layout
      },
      fontFamily: {
        'sans-bold-pro': ['sans-bold-pro'], // Nome do arquivo da fonte, sem a extensão
      },
    },
  },
  plugins: [],
};