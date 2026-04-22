/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors :{
        bgPrimary: '#f7f8f9',
        primary: '#222222',
        accent: '34495E',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: { fontWeight: '900' },
            h2: { fontWeight: '900' },
            h3: { fontWeight: '900' },
            blockquote: {
              fontStyle: 'normal',
              fontWeight: '600',
              borderLeftWidth: '8px',
              borderLeftColor: '#ea580c',
              backgroundColor: '#fff7ed',
              borderRadius: '0 32px 32px 0',
              padding: '1.5rem 2rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
