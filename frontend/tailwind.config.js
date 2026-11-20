/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12151F",
        panel: "#1A1F2E",
        line: "#2B3247",
        paper: "#ECE8E1",
        muted: "#98A0B5",
        marigold: "#F2B544",
        ok: "#5DBB9A",
        bad: "#E57373",
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
