import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "#FFFFFF",
        primary: "#AB3434",
        secondary: "#979797",
      },
      fontSize: {
        '64px': '64px',
        '200px': '200px',
      },
    },
  },
  plugins: [],
} satisfies Config;