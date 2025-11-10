/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        hotelMinimal: {
          "primary": "#C0A888",
          "primary-focus": "#A8926F",
          "primary-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F5F5F5",
          "base-300": "#E5E5E5",
          "base-content": "#1F2937",
          "accent": "#1E3A5F",
          "accent-focus": "#152A47",
          "accent-content": "#FFFFFF",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
          "info": "#3B82F6",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}

