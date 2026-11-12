/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        raw: {
          bg: "#E5E5E0",
          card: "#F4F4F0",
          white: "#FFFFFF",
          black: "#0A0A0A",
          grid: "#D4D4CE",
          muted: "#666660",
          light: "#EBEBE6",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0px #0A0A0A",
        "brutal-lg": "6px 6px 0px #0A0A0A",
        "brutal-sm": "2px 2px 0px #0A0A0A",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
