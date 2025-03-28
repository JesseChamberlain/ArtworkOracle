/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'class' for manual dark mode
  theme: {
    extend: {},
  },
  plugins: [],
};
