const config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#FFD700", 
      },
    },
  },
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
