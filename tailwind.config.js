/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "#000112",
      grey: {
        light: "#F4F7FD",
        create: "#E9EFFA",
        ["create-dark"]: "rgba(43,44,55,0.25)",
        medium: "#828FA3",
        dark: "#2B2C37",
        ["very-dark"]: "#20212C",
      },
      lines: {
        dark: "#3E3F4E",
        light: "#E4EBFA",
      },
      white: "#FFFFFF",
      purple: {
        DEFAULT: "#635FC7",
        hover: "#A8A4FF",
        10: "rgba(99,95,199,0.1)",
        25: "rgba(99,95,199,0.25)",
      },
      red: {
        DEFAULT: "#EA5555",
        hover: "#FF9898",
      },
      blue: "#49C4E5",
      green: "#67E2AE",
    },
    extend: {
      animation: {
        shake: "shake 1s ease-in-out",
      },
      keyframes: {
        shake: {
          "10%, 90%": {
            transform: "translate3d(-1px, 0, 0)",
          },
          "20%, 80%": {
            transform: "translate3d(2px, 0, 0)",
          },
          "30%, 50%, 70%": {
            transform: "translate3d(-4px, 0, 0)",
          },
          "40%, 60%": {
            transform: "translate3d(4px, 0, 0)",
          },
        },
      },
    },
  },
  plugins: [],
};
