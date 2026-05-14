/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest:   "#1a3a2a",
        forest2:  "#0f2419",
        moss:     "#2d5a3d",
        leaf:     "#4a8c5c",
        sage:     "#7fb896",
        cream:    "#fdf6e3",
        cream2:   "#f5edcf",
        amber:    "#e8a030",
        amber2:   "#f5c842",
        terra:    "#c4603a",
        terra2:   "#e87a4a",
        teal:     "#1a7070",
        sky:      "#2a90a8",
        sky2:     "#5bbdd4",
        lavender: "#7b6fa0",
        lav2:     "#a89fc8",
        bg:       "#0c1f14",
        bg2:      "#111f18",
      },
      fontFamily: {
        display: ["'Baloo 2'", "cursive"],
        body:    ["'Plus Jakarta Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
