/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-mint': '#00C9A7',
        'trust-navy': '#2C3E50',
        'soft-sage': '#F0F4F2',
        'clinical-sage': '#E2E8E5',
      },
    },
  },
  plugins: [],
}
