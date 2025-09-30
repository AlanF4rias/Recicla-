/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        "verde-principal": "#4EB003",
        "verde-secundario": "#03B90E",
        "cinza-fundo": "#E7EBE6",
        "cinza-texto": "#747773",
        "cinza-borda": "#BEC3BD",
        "preto-principal": "#141514",
      },
    },
  },
  plugins: [],
};
