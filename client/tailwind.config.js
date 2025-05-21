/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          500: "#4CAF50",
          600: "#388E3C",
        },
        blue: {
          500: "#2196F3",
          600: "#1976D2",
        },
      },
      fontFamily: {
        gilroy: ['Gilroy', 'sans-serif'],
        romie: ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-pattern': '24px 24px',
      },
      backdropBlur: {
        'sm': '4px',
      },
    },
  },
  plugins: [],
};
