/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.7s ease forwards",
        "fadeInUp-delay-1": "fadeInUp 0.7s ease 0.1s forwards",
        "fadeInUp-delay-2": "fadeInUp 0.7s ease 0.2s forwards",
        "fadeInUp-delay-3": "fadeInUp 0.7s ease 0.3s forwards",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
}