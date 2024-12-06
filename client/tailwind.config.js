/** @type {import('tailwindcss').Config} */
export default {content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { 
      lineHeight: {
        'extra-loose': '1',
      },
      fontSize:{
        biggest: '4.5rem',
        ssm: '0.5rem',
        smm: '0.775rem'
      },
      colors: {
        light_gradient_top: '#c2ffbc',
        dark_font: '#204d2c',
        light_font: '#4a7153',
        yellow_highlight: '#ffff00',
        dark_gradient_top: '#345e3e',
        light_gradient_bot: '#f0ffee',
        white_fb: '#f2f4f7',
        blue_btn: '#6788ff',
      },
      boxShadow: {
        top4xl: '0px -10px 100px 90px rgba(240, 255, 238,0.90)'
      },fontFamily:{
        mono: ["Sometype Mono", 'monospace'],
        primary: ["Inter", 'sans-serif'],
      }
    },
  },
  plugins: [],
}

