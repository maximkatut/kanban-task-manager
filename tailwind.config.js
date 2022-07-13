/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "#000112",
      grey: {
        light: "#F4F7FD",
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
      },
      red: {
        DEFAULT: "#EA5555",
        hover: "#FF9898",
      },
      blue: "#49C4E5",
      green: "#67E2AE",
    },
    extend: {},
  },
  plugins: [],
};
