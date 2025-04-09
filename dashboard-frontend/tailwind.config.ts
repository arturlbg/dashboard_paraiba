/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Scan all relevant files in src
    ],
    theme: {
      extend: {
         fontFamily: {
           // Define custom font families based on imports in fonts.css
           sans: ['Open Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
           lato: ['Lato', 'sans-serif'],
         },
         colors: {
           // Define custom colors if needed
           // Example:
           // primary: {
           //   light: '#67e8f9',
           //   DEFAULT: '#06b6d4',
           //   dark: '#0e7490',
           // },
         },
         // Add other theme extensions like spacing, borderRadius etc.
      },
    },
    plugins: [
       // Add any Tailwind plugins here, e.g., @tailwindcss/forms
       // require('@tailwindcss/forms'),
    ],
  }
  