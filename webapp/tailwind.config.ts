import type { Config } from "tailwindcss";

const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
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
        textPrimary: "#1E3700",
        main: "#006400",
        darkGreenApp: "#2C5300",
        greenApp: "#335F00",
        softGreenApp: "#539C00",
        yellowApp: "#FFCC32",
        softYellowApp: "#FFEDB6",
        orangeApp: "#F77F00",
        redApp: "#E60026",
        pinkApp: "#D71868",
        softPinkApp: "#EB3550",
        blueApp: "#1E90FF",
        darkPurpleApp: "#663399",
        purpleApp: "#823270",
        softPurpleApp: "#4947D4",
        softPurpleApp2: "#823270",
      },
    },
  },
});

export default config;
