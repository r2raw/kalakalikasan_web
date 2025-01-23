import React from 'react'
import EuroSymbolSharpIcon from '@mui/icons-material/EuroSymbolSharp';
function ServiceCard() {
  return (
    <div className='shadow-md bg-[#ebffe1] relative px-10 py-20 rounded-md'>
      <div className='rounded-full bg-dark_font w-40 h-40 flex justify-center items-center text-white text-4xl absolute -top-1/2 translate-y-1/2 shadow-xl left-1/2 -translate-x-1/2'>
        <EuroSymbolSharpIcon sx={{ fontSize: '200%' }} />
      </div>

      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        In dolor blanditiis dolore iusto ex sequi atque minus modi,
        accusamus earum aspernatur quasi sint! Veritatis facilis quibusdam
        minus beatae minima sit ea quia aliquam molestias. Modi provident officiis minima facere earum.</p>
    </div>
  )
}

export default ServiceCard