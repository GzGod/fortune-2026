import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'fortune-red': '#c41e3a',
        'fortune-gold': '#ffd700',
        'fortune-dark': '#1a1a2e',
      },
      backgroundImage: {
        'gradient-fortune': 'linear-gradient(135deg, #c41e3a 0%, #ff6b6b 50%, #ffd700 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
