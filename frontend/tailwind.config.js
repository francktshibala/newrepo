// Create a file called tailwind.config.js with this content:
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: '#2196f3',
          secondary: '#0d47a1',
          accent: '#1976d2',
          navBg: '#fec601',
          navLink: '#f9f9f9',
          navHoverLink: '#001F54',
          navHoverBg: '#FEFCFB',
        },
        fontFamily: {
          heading: ['Bree Serif', 'serif'],
          body: ['Inter', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }