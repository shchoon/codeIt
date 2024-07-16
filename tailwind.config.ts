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
        "slate-900": "#0F172A",
        "slate-800": "#1E293B",
        "slate-500": "#64748B",
        "slate-400": "#94A3B8",
        "slate-300": "#CBD5E1",
        "slate-200": "#E2E8F0",
        "slate-100": "#F1F5F9",
        "lime-300": "#BEF264",
        "green-700": "#15803D",
        "amber-300": "#FCD34D",
        "yellow-50": "#FEFCE8",
      },
    },
    screens: {
      mobile: { max: "376px" },
      tablet: { min: "376px", max: "1280px" },
      deskTop: { min: "1281px" },
    },
  },
  plugins: [],
};
export default config;
