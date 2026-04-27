import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        clay: "var(--clay)",
        olive: "var(--olive)",
        accent: "var(--accent)",
        rust: "var(--rust)"
      },
      boxShadow: {
        art: "0 18px 40px rgba(26, 40, 35, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
