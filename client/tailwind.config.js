/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      lineHeight: {
        'extra-loose': '1',
      },
      fontSize: {
        biggest: '4.5rem',
        ssm: '0.5rem',
        smm: '0.775rem'
      },
      colors: {
        base_color: '#F4F4F2',
        secondary_color: '#204d2c',
        accent_color: '#5A9E8C',
        light_gradient_top: '#c2ffbc',
        dark_font: '#204d2c',
        light_font: '#333333',
        yellow_highlight: '#ffff00',
        dark_gradient_top: '#345e3e',
        light_gradient_bot: '#f0ffee',
        white_fb: '#f2f4f7',
        blue_btn: '#6788ff',
        warning_color: '#E8A87C',
        red_highlight: '#D9534F',
        pastel_green: '#A9D9B4',
      },
      boxShadow: {
        cardShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        top4xl: '0px -10px 100px 90px rgba(240, 255, 238,0.90)'
      }, fontFamily: {
        mono: ["Sometype Mono", 'monospace'],
        primary: ["Inter", 'sans-serif'],
      }
    },
  },
  plugins: [function ({ addUtilities }) {
    addUtilities({
      '.scrollbar-hide': {
        '-ms-overflow-style': 'none', // IE and Edge
        'scrollbar-width': 'none',   // Firefox
      },
      '.scrollbar-hide::-webkit-scrollbar': {
        display: 'none',             // Chrome, Safari, and Opera
      },
    });
  },],
}

