/** @type {import('tailwindcss').Config} */
const whiteLabeled = false;
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        mainColor: whiteLabeled ? "#c82021" : "#CB85FF",
        shadedColor: whiteLabeled ? "#e7452f" : "#CB85FF",
        secondColor: whiteLabeled ? "#c82021" : "#A482FF",
        thirdColor: whiteLabeled ? "#c82021" : "#D5FF7A",
        fourthColor: whiteLabeled ? "#c82021" : "#CDECF7",
        // secondColor: '#D4DDFF',
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        allround: ['"All Round Gothic"', "sans-serif"],
      },
      screens: {
        xs: "365px",
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
    },
  },
  plugins: [],
};
