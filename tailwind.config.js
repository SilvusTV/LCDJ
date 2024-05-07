/** @type {import("tailwindcss").Config} */
export default {
  content: ['./index.html', './inertia/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    borderRadius: {
      'none': '0',
      'sm': '0.125rem',
      'md': '0.375rem',
      'lg': '0.5rem',
      'full': '9999px',
      'xlg': '3rem',
    }
  },
  plugins: [],
}
